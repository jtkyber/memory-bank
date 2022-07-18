import mongoose from 'mongoose';

const connectMongo = async () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true
    })
}

export default connectMongo;