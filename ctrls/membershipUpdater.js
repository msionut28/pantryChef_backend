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