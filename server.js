import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
// import fetch from 'node-fetch';
import 'dotenv/config';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path'

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
const recipe = mongoose.createConnection(process.env.DATABASE_URL)


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

const Recipe = recipe.model('Recipe', recipeSchema);

//*ROUTERS
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
