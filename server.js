import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path'
import 'dotenv/config';
import { adminGenerator } from './ctrls/admin.js';
import { firstTimeChecker } from './ctrls/loginChecker.js';
import { userRecipe } from './ctrls/usersRecipe.js';
import { membershipUpdater } from './ctrls/membershipUpdater.js'
import { userAdd } from './ctrls/userAdd.js'
import { recipeGenerator } from './ctrls/recipeGenerator.js';
import { postCreator } from './ctrls/postCreator.js';

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
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
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
    password: String,
    lastLogin: String,
    membership: {type: Number, default: 0},
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'generatedRecipe' }],
    isAdmin: {type: Boolean, default: false}
})
const generatedRecipeSchema = new mongoose.Schema({
    title: String,
    ingredients: [String],
    description: String
})

const Recipe = pantryChef.model('Recipe', recipeSchema);
const userAdded = pantryChef.model('User', userSchema)
const generatedRecipe = pantryChef.model('generatedRecipe', generatedRecipeSchema)
adminGenerator(userAdded)

//*ROUTERS
app.post('/create/', async (req, res) => {
    recipeGenerator(generatedRecipe, req, res)
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
    postCreator(Recipe, req, res)
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
    userAdd(userAdded, req, res)
})
app.put('/users/:userName', async (req, res) => {
    membershipUpdater(userAdded, req, res)
})
app.post('/users/:userName/addrecipe', async (req, res) => {
    userRecipe(userAdded, req, res)
});
  
app.get('/users/:userName', async (req, res) => {
    const userName = req.params.userName
    const user = await userAdded.findOne({userName: userName})
    res.json(user)
})
app.get('/users/', async (req, res) => {
    const user = await userAdded.find({})
    res.json(user)
})

app.post('/logincheck', async (req, res) => {
    firstTimeChecker(userAdded, req, res)
});
