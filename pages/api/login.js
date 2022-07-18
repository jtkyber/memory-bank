import connectMongo from '../../utils/connectDB';
import User from '../../models/userModel';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    try {
        const { username, password } = req.body;
        console.log(username)
        await connectMongo();
        const user = await User.findOne({ username: username })
        if (!user) throw new Error('Could not find user')
        else {
            const pwMatch = await bcrypt.compare(password, user.password);
            if (pwMatch) {
                res.json({
                    id: user._id,
                    username: user.username,
                    allTags: user.allTags
                });
            } else throw new Error('Incorrect password')
        }
    } catch(err) {
        console.log(err)
        res.status(404).json(`${err}`)
    }
}