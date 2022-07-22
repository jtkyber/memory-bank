import connectMongo from '../../utils/connectDB';
import User from '../../models/userModel';
// import { getFileStream } from '../../s3';

export default async function handler(req, res) {
    try {
        const { userID, tag } = req.query
        console.log(tag)
        await connectMongo()

        const photosResult = await User.findOne({ _id: userID }).select('photos')
        const allPhotos = photosResult.photos

        if (!allPhotos) throw new Error('No photos found')

        const filteredPhotos = allPhotos.filter(photo => photo.tags.split(',').includes(tag))
        res.json(filteredPhotos)
    } catch(err) {
        console.log(err)
        res.status(404).json(`${err}`)
    }
}