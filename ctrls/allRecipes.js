export async function allRecipes(Recipe, res){
    const generated = await Recipe.find({});
    res.json(generated) 
}