import OpenAI from 'openai';

//*AI API SETUP
const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET,
    organization: 'org-axGe7UfgD3YPqfLzyxripC4n'
});


//*RANDOM RECIPE GENERATOR
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'e557c64142msh0b3f3a1eb713062p1286a9jsn5fb379a70f82',
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
  }
}
const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=pasta&cuisine=italian&excludeCuisine=greek&diet=vegetarian&intolerances=gluten&equipment=pan&includeIngredients=tomato%2Ccheese&excludeIngredients=eggs&type=main%20course&instructionsRequired=true&fillIngredients=false&addRecipeInformation=false&titleMatch=Crock%20Pot&maxReadyTime=20&ignorePantry=true&sort=calories&sortDirection=asc&minCarbs=10&maxCarbs=100&minProtein=10&maxProtein=100&minCalories=50&maxCalories=800&minFat=10&maxFat=100&minAlcohol=0&maxAlcohol=100&minCaffeine=0&maxCaffeine=100&minCopper=0&maxCopper=100&minCalcium=0&maxCalcium=100&minCholine=0&maxCholine=100&minCholesterol=0&maxCholesterol=100&minFluoride=0&maxFluoride=100&minSaturatedFat=0&maxSaturatedFat=100&minVitaminA=0&maxVitaminA=100&minVitaminC=0&maxVitaminC=100&minVitaminD=0&maxVitaminD=100&minVitaminE=0&maxVitaminE=100&minVitaminK=0&maxVitaminK=100&minVitaminB1=0&maxVitaminB1=100&minVitaminB2=0&maxVitaminB2=100&minVitaminB5=0&maxVitaminB5=100&minVitaminB3=0&maxVitaminB3=100&minVitaminB6=0&maxVitaminB6=100&minVitaminB12=0&maxVitaminB12=100&minFiber=0&maxFiber=100&minFolate=0&maxFolate=100&minFolicAcid=0&maxFolicAcid=100&minIodine=0&maxIodine=100&minIron=0&maxIron=100&minMagnesium=0&maxMagnesium=100&minManganese=0&maxManganese=100&minPhosphorus=0&maxPhosphorus=100&minPotassium=0&maxPotassium=100&minSelenium=0&maxSelenium=100&minSodium=0&maxSodium=100&minSugar=0&maxSugar=100&minZinc=0&maxZinc=100&offset=0&number=10&limitLicense=false&ranking=2'

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

export async function randomRecipe() {
  try {
    const response = await fetch(url, options);
    const data = await response.json()
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}