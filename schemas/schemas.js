import mongoose from 'mongoose';

export const recipeSchema = new mongoose.Schema({
    title: String,
    time: String,
    people: String,
    calories: String,
    difficulty: String,
    description: String,
    instructions: String,
    ingredients: [String],
    image: String
})
export const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    lastLogin: String,
    membership: {type: Number, default: 0},
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'generatedRecipe' }],
    isAdmin: {type: Boolean, default: false}
})
export const generatedRecipeSchema = new mongoose.Schema({
    title: String,
    ingredients: [String],
    description: String
})