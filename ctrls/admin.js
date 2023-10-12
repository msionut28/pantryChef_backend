import bcrypt from 'bcrypt';

export async function adminGenerator(User) {
    try {
        const admin = await User.findOne({ userName: 'admin' });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin', 10)
            const timestamp = Date.now()
            const currentTime = new Date(timestamp)
            const addAdmin = new User({
                userName: 'admin',
                password: hashedPassword,
                lastLogin: currentTime,
                membership: 3,
                isAdmin: true
            })
            addAdmin.save();
        } else {
            console.log('No need to create a new admin, it already exists.');
        }
    }catch(error) {
        console.error('COULD NOT CREATE A NEW ADMIN', error)
    }
}