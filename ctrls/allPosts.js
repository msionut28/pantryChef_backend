export async function allPosts(Recipe, res) {
    const recipes = await Recipe.find({});
    res.json(recipes) 
}