import connectMongo from '../../utils/connectDB';
import User from '../../models/userModel';

export default async function handler(req, res) {
    try {
        const { userID, tagName } = req.body
        await connectMongo()

        const data = await User.findOne({ _id: userID }).select('allTags')
        const allTags = data?.allTags

        if (!allTags) throw new Error('No tags found')

        const newTagList = allTags

        for (let tag of newTagList) {
            if (tag.name === tagName) {
                tag.weight = JSON.parse(tag.weight) + 1
                break
            }
        }

        newTagList.sort((a, b) => {
            return b.weight - a.weight
        })

        await User.updateOne( { _id: userID }, { allTags: newTagList })

        res.json(newTagList)
    } catch(err) {
        console.log(err)
        res.status(404).json(`${err}`)
    }
}