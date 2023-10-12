export async function individualUser(User, req, res){
    const userName = req.params.userName
    const user = await User.findOne({userName: userName})
    res.json(user)
}