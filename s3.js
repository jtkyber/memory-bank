import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_KEY;
const secretAccessKey = process.env.AWS_KEY_SECRET;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

// creates presigned POST

export const createPresignedPost = async (filename, filetype) => {
    const post = await s3.createPresignedPost({
        Bucket: bucketName,
        Fields: {
            key: filename,
            'Content-Type': filetype,
        },
        Expires: 60,
        Conditions: [
            ['content-length-range', 0, 20000000]
        ]
    })
    return post;
}

// uploads a file to s3

export const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise();
}

exports.uploadFile = uploadFile;

// downloads a file from s3

export const getFileStream = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream()
}