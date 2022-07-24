import connectMongo from '../../utils/connectDB';
import User from '../../models/userModel';

export default async function handler(req, res) {
    try {
        const { userID, key } = req.body
        await connectMongo()
        const bgLink = `https://memory-bank-bucket.s3.amazonaws.com/${key}`
        
        await User.updateOne( { _id: userID }, { bgImage: bgLink })

        res.json(bgLink)
    } catch(err) {
        console.log(err)
        res.status(404).json(`${err}`)
    }
}