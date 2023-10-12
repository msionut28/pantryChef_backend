import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

export async function loginCredentials(User, req, res){
    const { userName, password } = req.body
    const user = await User.findOne({ userName: userName  })
    if (!user) {
        console.log('USER NOT FOUND!');
        return res.status(401).json({ message: 'User not found!' })
    }
    const passwordCheck = await bcrypt.compare(password, user.password)
    if (!passwordCheck) {
        console.log('PASSWORD DOES NOT MATCH!');
        return res.status(401).json({ message: 'Password does not match!' })
    }
    const token = jwt.sign({ userId: user._id, userName: user.username, isAdmin: user.isAdmin}, process.env.JWT_TOKEN, {expiresIn: '2h'})
    res.status(200).json({ token, isAdmin: user.isAdmin })
}

export async function allUsers(User, res){
    const user = await User.find({})
    res.json(user)
}

export async function individualUser(User, req, res){
    const userName = req.params.userName
    const user = await User.findOne({userName: userName})
    res.json(user)
}

export async function firstTimeChecker(User, req, res){
    const userName = req.body.userName;
    try {
        const user = await User.findOne({ userName: userName });
        if (user) {
            if (user.membership === 0) {
                res.json(true);
            } else {
                res.json(false);
            }
        } else {
            res.json(true);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function membershipUpdater(User, req, res) {
    const userName = req.params.userName
    const newMembership = req.body.membership
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userName: userName },
            { $set: { membership: newMembership } },
            { new: true }
          );
          if (updatedUser){
            return res.status(200).json({ message: 'Membership updated successfully' })
    } else{
        return res.status(404).json({message: 'Membership could not be updated'})
    }
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
}

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