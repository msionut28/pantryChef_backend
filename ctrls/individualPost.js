export async function individualPost(Recipe, req, res){
    const id = req.params.id
    const recipes = await Recipe.findById(id)
    res.json(recipes)
}