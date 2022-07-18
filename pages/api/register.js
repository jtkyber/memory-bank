import connectMongo from '../../utils/connectDB';
import User from '../../models/userModel';
const bcrypt = require('bcrypt');

export default async function handler(req, res) {
    try {
        const { username, password } = req.body;
        await connectMongo();
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                const newUser = await User.create({
                    "username": username,
                    "password": hash
                });

                res.json({
                    id: newUser._id,
                    username: newUser.username,
                    allTags: newUser.allTags
                });
            })
        })
    } catch(err) {
        console.log(err)
    }
}