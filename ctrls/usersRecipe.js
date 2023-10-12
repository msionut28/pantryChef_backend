export async function userRecipe(User, req, res){
    const userName = req.params.userName
    const recipeId = req.body.recipeId
    const user = await User.findOne({ userName: userName })
    user.recipes.push(recipeId)
    
    try {
      await user.save();
      return res.status(200).json({ message: 'Recipe added to user' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Failed to update user record' })
    }
}