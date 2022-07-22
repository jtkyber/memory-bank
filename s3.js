import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
import dynamic from 'next/dynamic';
// import S3FileUpload from 'react-s3/lib/ReactS3';
// const S3FileUpload = dynamic(import('react-s3/lib/ReactS3'), {ssr: false});

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_KEY;
const secretAccessKey = process.env.AWS_KEY_SECRET;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

// uploads a file to s3

export const uploadFile = async (file) => {
    // const fileStream = fs.createReadStream(file.path);

    // const uploadParams = {
    //     Bucket: bucketName,
    //     Body: fileStream,
    //     Key: file.filename
    // }

    // return s3.upload(uploadParams).promise();
    const S3FileUpload = (await import('react-s3/lib/ReactS3')).default
    console.log(S3FileUpload.location)

    const config = {
        bucketName: bucketName,
        region: region,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }

    const data = S3FileUpload.uploadFile(file, config)
    console.log(data)
    return data;
}

// exports.uploadFile = uploadFile;

// downloads a file from s3

export const getFileStream = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream()
}