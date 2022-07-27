import connectMongo from '../../utils/connectDB';
import User from '../../models/userModel';
const bcrypt = require('bcrypt');

export default async function handler(req, res) {
    try {
        const { username, password } = req.body;
        await connectMongo();
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                User.create({"username": username, "password": hash}, (error, newUser, next) => {
                    if (newUser?._id) {
                        res.json({
                            id: newUser._id,
                            username: newUser.username,
                            allTags: newUser.allTags,
                            bgImage: null
                        });
                    } else {
                        if (error.code === 11000) {
                            res.status(400).json('Username already exists')
                        } else res.status(400).json('Unable to add user')
                    }
                });
            })
        })
    } catch(err) {
        console.log(err)
        res.status(400).json(err)
    }
}