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