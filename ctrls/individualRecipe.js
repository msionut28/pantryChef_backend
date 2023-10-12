export async function individualRecipe(Recipe, req, res){
    const id = req.params.id
    const generated = await Recipe.findById(id)
    res.json(generated)
}