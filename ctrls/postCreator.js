
export  async function postCreator(Recipe, req, res){
    const imagePath = req.file.filename 
    const imageUrl = `http://localhost:4000/assets/${imagePath}`
    const recipe = req.body
    const list = new Recipe({title: recipe.title, description: recipe.description, image: imageUrl})
    list.save()
    .then(() => {
        console.log(`New ${recipe.title} recipe added! Description: ${recipe.description}`);
        res.sendStatus(200)
    })
    .catch(error => {
        console.error(error)
        res.sendStatus(error)
    })
}