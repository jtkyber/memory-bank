import connectMongo from '../../utils/connectDB';
import User from '../../models/userModel';

import { createRouter } from 'next-connect';
const router = createRouter();

// import multer from 'multer';
// const upload = multer({ dest: 'uploads/'});

import { createPresignedPost } from '../../s3';

// import fs from 'fs';
// import util from 'util';
// const unlinkFile = util.promisify(fs.unlink);


router
// .use(upload.single('image'))
.get(async (req, res) => {
  const { filename, filetype } = req.query;
  const post = await createPresignedPost(filename, filetype);
  res.status(200).json(post)
})
.post(async (req, res) => {
  try {
    await connectMongo();
    const { description, location, tags, id, key } = req.body;
    if (!id.length) throw new Error('Cannot add image while logged out')
    
    // await uploadFile(file);
    // await unlinkFile(file.path);
    
    const photo = {
      key: key,
      tags: tags,
      description: description,
      location: location
    }
    
    await User.updateOne( { _id: id }, { $push: { photos: photo }})

    let allTags = await User.findOne({ _id: id }).select({ allTags: 1, _id: 0 });
    allTags = allTags?.allTags;

    const currentTags = tags.map(tag => {
      return [tag, 0]
    });

    let newTagList = [];

    if (allTags?.length) {
      const newTags = currentTags.filter(tag => {
        for (let existingTag of allTags) {
          if (existingTag[0] === tag[0]) return
        }
        return tag
      })

      newTagList = allTags.concat(newTags);
    } else newTagList = currentTags
    
    await User.updateOne( { _id: id }, { allTags: newTagList })

    res.json(newTagList)
  } catch(err) {
    console.log(err)
    res.status(404).json(`${err}`)
  }
})
    
export default router.handler({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

export const config = {
  api: {
    bodyParser: true
  }
}
