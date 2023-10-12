import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path'
import 'dotenv/config';
import { adminGenerator } from './ctrls/admin.js';
import { loginCredentials, allUsers, individualUser, firstTimeChecker, membershipUpdater, userAdd, userRecipe } from './ctrls/userFunctions.js';
import { postCreator, allPosts, individualPost } from './ctrls/postsFunctions.js';
import { recipeGenerator, allRecipes, individualRecipe, deleteRecipe, editRecipe} from './ctrls/recipeFunctions.js';
import { generatedRecipeSchema, recipeSchema, userSchema } from './schemas/schemas.js';


//*APP SETUP
const app = express()
const port = process.env.PORT || 4000
app.use(cors())
app.use(bodyParser.json())
app.use('/assets', express.static('assets'))
app.listen(port, () => { console.log(`listenting on port: ${port}`); })

//*DATABASE CONNECTION AND SETTINGS
const pantryChef = mongoose.createConnection(process.env.DATABASE_URL)
const Recipe = pantryChef.model('Recipe', recipeSchema);
const userAdded = pantryChef.model('User', userSchema)
const generatedRecipe = pantryChef.model('generatedRecipe', generatedRecipeSchema)
adminGenerator(userAdded)

//*UPLOADER SETTINGS
const storage = multer.diskStorage({
    destination: './assets',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })



//*ROUTERS
app.post('/create/', async (req, res) => {
    recipeGenerator(generatedRecipe, req, res)
})
app.get('/generated/:id', async (req, res) => {
    individualRecipe(generatedRecipe, req, res)
})
app.get('/generated', async(req, res) => {
    allRecipes(generatedRecipe, res)
})
app.post('/recipes/add', upload.single('image'), (req, res) => {
    postCreator(Recipe, req, res)
})
app.get('/recipes', async(req, res) => {
    allPosts(Recipe, res)
})
app.get('/recipes/:id', async (req, res) => {
    individualPost(Recipe, req, res)
})
app.delete('/recipes/:id', async (req, res) => {
    deleteRecipe(Recipe,  req, res)
})
app.put('/recipes/:id', async (req, res) => {
    editRecipe(Recipe, req, res)
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
    individualUser(userAdded, req, res)
})
app.get('/users/', async (req, res) => {
    allUsers(userAdded, res)
})
app.post('/logincheck', async (req, res) => {
    firstTimeChecker(userAdded, req, res)
});
app.post('/login', async(req,res) => {
    loginCredentials(userAdded, req, res)
})
