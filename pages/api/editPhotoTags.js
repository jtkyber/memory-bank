import connectMongo from '../../utils/connectDB';
import User from '../../models/userModel';

export default async function handler(req, res) {
    try {
        const { userID, key, currentTags, originalTags } = req.body
        await connectMongo()

        const photoData = await User.findOne({ _id: userID }).select('photos')
        const photos = photoData?.photos
        const allTagsData = await User.findOne({ _id: userID }).select('allTags')
        const allTags = allTagsData?.allTags

        if (!photos) throw new Error('No tags found')

        const allTagsNew = allTags;
        allTagsNew.forEach(tag => {
            if (currentTags.includes(tag.name)) tag.count += 1
        })

        allTagsNew.forEach((tag, i) => {
            if (originalTags.includes(tag.name)) {
                if (tag.count > 1) tag.count -= 1
                else allTagsNew.splice(i, 1)
            }
        })
        
        const simplifiedTags = allTagsNew.map(tag => tag.name)
        currentTags.forEach(tag => {
            if (!simplifiedTags.includes(tag)) {
                allTagsNew.push({
                    name: tag,
                    weight: 0,
                    count: 1
                })
            }
        })

        const newPhotos = photos
        for (let photo of newPhotos) {
            if (photo.key === key) {
                photo.tags = currentTags
                break
            }
        }
        
        await User.updateOne({ _id: userID }, { allTags: allTagsNew })
        await User.updateOne({ _id: userID }, { photos: newPhotos })
        res.json({allTagsNew, newPhotos})
    } catch(err) {
        console.log(err)
        res.status(404).json(`${err}`)
    }
}