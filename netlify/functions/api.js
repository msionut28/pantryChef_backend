import express, {Router} from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
// import multer from 'multer';
// import path from 'path'
import 'dotenv/config';
import { adminGenerator } from '../../ctrls/admin.js';
import { loginCredentials, allUsers, individualUser, firstTimeChecker, membershipUpdater, userAdd, userRecipe } from '../../ctrls/userFunctions.js';
import { postCreator, allPosts, individualPost } from '../../ctrls/postsFunctions.js';
import { recipeGenerator, allRecipes, individualRecipe, deleteRecipe, editRecipe} from '../../ctrls/recipeFunctions.js';
import { generatedRecipeSchema, recipeSchema, userSchema } from '../../schemas/schemas.js';

//*APP SETUP
const api = express()
// const port = process.env.PORT || 4000
api.use(cors())
api.use(bodyParser.json())
// api.use('/assets', express.static('assets'))
// app.listen(port, () => { console.log(`listenting on port: ${port}`); })

//*DB CONNECTION AND SETTINGS
const pantryChef = mongoose.createConnection(process.env.DATABASE_URL)
const Recipe = pantryChef.model('Recipe', recipeSchema);
const userAdded = pantryChef.model('User', userSchema)
const generatedRecipe = pantryChef.model('generatedRecipe', generatedRecipeSchema)
adminGenerator(userAdded)

//*UPLOADER SETTINGS
// const storage = multer.diskStorage({
//     destination: './assets',
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// })
// const upload = multer({ storage: storage })

//*ROUTER
const router = Router()
router.post('/create/', async (req, res) => {
    recipeGenerator(generatedRecipe, req, res)
})
router.get('/generated/:id', async (req, res) => {
    individualRecipe(generatedRecipe, req, res)
})
router.delete('/generated/:id', async (req, res) => {
    deleteRecipe(generatedRecipe, userAdded, req, res)
})
router.get('/generated', async(req, res) => {
    allRecipes(generatedRecipe, res)
})
// router.post('/recipes/add', upload.single('image'), (req, res) => {
//     postCreator(Recipe, req, res)
// })
router.get('/recipes', async(req, res) => {
    allPosts(Recipe, res)
})
router.get('/recipes/:id', async (req, res) => {
    individualPost(Recipe, req, res)
})
router.delete('/recipes/:id', async (req, res) => {
deleteRecipe(Recipe,  req, res)
})
router.put('/recipes/:id', async (req, res) => {
    editRecipe(Recipe, req, res)
})
router.post('/useradd', (req, res) => {
    userAdd(userAdded, req, res)
})
router.put('/users/:userName', async (req, res) => {
    membershipUpdater(userAdded, req, res)
})
router.post('/users/:userName/addrecipe', async (req, res) => {
    userRecipe(userAdded, req, res)
});
router.get('/users/:userName', async (req, res) => {
    individualUser(userAdded, req, res)
})
router.get('/users/', async (req, res) => {
    allUsers(userAdded, res)
})
router.post('/logincheck', async (req, res) => {
    firstTimeChecker(userAdded, req, res)
});
router.post('/login', async(req,res) => {
    loginCredentials(userAdded, req, res)
})
api.use('/api/', router)

export const handler = serverless(api)