import OpenAI from 'openai';

//*AI API SETUP
const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET,
    organization: 'org-axGe7UfgD3YPqfLzyxripC4n'
});

export async function recipeGenerator (Recipe, req, res) {
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
        const generateRecipe = new Recipe({title: recipe.title.toLowerCase(), ingredients: recipe.ingredients, description: description})
        const savedRecipe = await generateRecipe.save()
        const savedRecipeId = savedRecipe._id
        res.status(201).json({ _id: savedRecipeId })
    } catch(error){
        console.error(error)
    }
}

export async function individualRecipe(Recipe, req, res){
    const id = req.params.id
    const generated = await Recipe.findById(id)
    res.json(generated)
}

export async function allRecipes(Recipe, res){
    const generated = await Recipe.find({});
    res.json(generated) 
}

export async function deleteRecipe(Recipe, User, req, res){
    try {
      const currentUser = await User.find({ "recipes": req.params.id })
      if (currentUser.length === 0) {
        return res.status(404).json({ error: "Recipe not found in user's recipes" })
      }
      const user = currentUser[0];
      const userRecipe = user.recipes;
      const dbRecipeId = req.params.id;
      const recipeIndex = userRecipe.findIndex((recipeRef) =>
        recipeRef.equals(dbRecipeId)
      )
      if (recipeIndex === -1) {
        return res.status(404).json({ error: "Recipe not found in user's recipes" })
      }
      user.recipes.splice(recipeIndex, 1)
      await user.save()
      await Recipe.findByIdAndRemove(dbRecipeId)
      res.json({ message: 'Recipe deleted' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Internal server error" })
    }
}

export async function editRecipe(Recipe, req, res){
  const recipe = req.body
  Recipe.updateOne({"_id": req.params.id}, {
    title: recipe.title,
    time: recipe.time,
    people: recipe.people,
    calories: recipe.calories,
    difficulty: recipe.difficulty, 
    description: recipe.description, 
    instructions: recipe.instructions,
    ingredients: recipe.ingredients})
  .then(() => {
      res.json({message: 'Recipe updated!'})
  })
  .catch(error => {
      res.sendStatus(500)
  })
}