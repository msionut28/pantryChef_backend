import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
// import fetch from 'node-fetch';
import 'dotenv/config';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path'
import OpenAI from 'openai';

//*AI API SETUP
const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET,
    organization: 'org-axGe7UfgD3YPqfLzyxripC4n'
});

//*APP SETUP
const app = express()
const port = process.env.PORT || 4000
app.use(cors())
app.use(bodyParser.json())
app.use('/assets', express.static('assets'))
app.listen(port, () => {
    console.log(`listenting on port: ${port}`);
})

//*DATABASE CONNECTION
const pantryChef = mongoose.createConnection(process.env.DATABASE_URL)


//*UPLOADER SETTINGS
const storage = multer.diskStorage({
    destination: './assets',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage })
//*SCHEMAS
const recipeSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String
})
const userSchema = new mongoose.Schema({
    userName: String,
    lastLogin: String
})
const generatedRecipeSchema = new mongoose.Schema({
    title: String,
    ingredients: [String],
    description: String
})

const Recipe = pantryChef.model('Recipe', recipeSchema);
const userAdded = pantryChef.model('User', userSchema)
const generatedRecipe = pantryChef.model('generatedRecipe', generatedRecipeSchema)
//*ROUTERS
app.post('/create/', async (req, res) => {
    const recipe = req.body
    const list = recipe.ingredients.join(', ')
    async function main(ingredients) {
        try {
          const completion = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: `What can I cook with these ingredients ${ingredients}in a short response with instructions?`,
            max_tokens: 250,
            temperature: 0,
          });
          return completion.choices[0].text
        } catch (error) {
          console.error(error);
          throw error
        }
      }
    try{
        const description = await main(list)
        const generateRecipe = new generatedRecipe({title: recipe.title.toLowerCase(), ingredients: recipe.ingredients, description: description})
        const savedRecipe = await generateRecipe.save()
        const savedRecipeId = savedRecipe._id
        res.status(201).json({ _id: savedRecipeId })
    } catch(error){
        console.error(error)
    }
})
app.get('/generated/:id', async (req, res) => {
    const id = req.params.id
    const generated = await generatedRecipe.findById(id)
    res.json(generated)
})
app.get('/generated', async(req, res) => {
    const generated = await generatedRecipe.find({});
    res.json(generated) 
})
app.post('/recipes/add', upload.single('image'), (req, res) => {
    const imagePath = req.file.filename 
    const imageUrl = `http://localhost:4000/assets/${imagePath}`
    const recipe = req.body
    const list = new Recipe({title: recipe.title, description: recipe.description, image: imageUrl})
    list.save()
    .then(() => {
        console.log(`New ${recipe.title} recipe added! Description: ${recipe.description}`);
        res.sendStatus(200)
    })
    .catch(error => {
        console.error(error)
        res.sendStatus(error)
    })
})
app.get('/recipes', async(req, res) => {
    const recipes = await Recipe.find({});
    res.json(recipes) 
})
app.get('/recipes/:id', async (req, res) => {
    const id = req.params.id
    const recipes = await Recipe.findById(id)
    res.json(recipes)
})
app.post('/useradd', (req, res) => {
    const data = req.body
    userAdded.findOne({ userName: data.userName})
    .then((user) => {
        if(user) {
            user.lastLogin = (data.lastLogin)
            user.save()
        } else {
            const addUser = new userAdded({userName: data.userName, lastLogin: data.lastLogin })
            addUser.save()
        }
    })
    console.log(`User's ${data.userName} last login was: ${data.lastLogin}`);
    res.sendStatus(200)
})
