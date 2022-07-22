import connectMongo from '../../utils/connectDB';
import User from '../../models/userModel';

import { createRouter } from 'next-connect';
const router = createRouter();

import multer from 'multer';
// const upload = multer({ dest: 'uploads/'});

import { uploadFile, getFileStream } from '../../s3';

import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);


router
// .use(upload.single('image'))
.post(async (req, res) => {
  try {
    await connectMongo();

    // const file = req.file;
    console.log(req.body)
    const { description, location, tags, id, filename } = req.body;
    if (!id.length) throw new Error('Cannot add image while logged out')
    
    // await uploadFile(file);
    // await unlinkFile(file.path);
    
    const photo = {
      key: filename,
      tags: tags,
      description: description,
      location: location
    }
    
    // await User.updateOne( { _id: id }, { $push: { photos: photo }})

    // const tagArray = tags.length >= 2 ? tags.split(',') : [tags];

    // let allTags = await User.findOne({ _id: id }).select({ allTags: 1, _id: 0 });
    // allTags = allTags?.allTags;

    // let newTagList = '';

    // if (allTags?.length) {
    //   const existingTagArray = allTags.length >= 2 ? allTags.split(',') : [allTags]; 
    //   const newTagArray = tagArray.filter(tag => !existingTagArray.includes(tag))
    //   newTagList = existingTagArray.concat(newTagArray).join(',');
    // } else newTagList = tags
    
    // await User.updateOne( { _id: id }, { allTags: newTagList })

    res.json(photo)
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
    bodyParser: false
  }
}
