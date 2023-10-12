export async function userAdd(User, req, res){
    const data = req.body
    const membershipStart = 0
    User.findOne({ userName: data.userName})
    .then((user) => {
        if(user) {
            user.lastLogin = (data.lastLogin)
            user.save()
        } else {
            const addUser = new User({userName: data.userName, lastLogin: data.lastLogin, membership: membershipStart})
            addUser.save()
        }
    })

    res.sendStatus(200)
}