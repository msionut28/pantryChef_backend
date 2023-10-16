export async function allPosts(Recipe, res) {
    const recipes = await Recipe.find({});
    res.json(recipes) 
}
export async function individualPost(Recipe, req, res){
    const id = req.params.id
    const recipes = await Recipe.findById(id)
    res.json(recipes)
}
export  async function postCreator(Recipe, req, res){
    const recipe = req.body
    const list = new Recipe({
        title: recipe.title,
        time: recipe.time,
        people: recipe.people,
        calories: recipe.calories,
        difficulty: recipe.difficulty, 
        description: recipe.description, 
        instructions: recipe.instructions,
        ingredients: recipe.ingredients,
        image: recipe.image
    })
    list.save()
    .then(() => {
        console.log(`New ${recipe.title} recipe added!`);
        res.sendStatus(200)
    })
    .catch(error => {
        console.error(error)
        res.sendStatus(error)
    })
}