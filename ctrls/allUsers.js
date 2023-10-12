export async function allUsers(User, res){
    const user = await User.find({})
    res.json(user)
}