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