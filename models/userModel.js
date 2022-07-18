import { Schema, model, models } from "mongoose";

const photoSchema = new Schema({
    key: String,
    tags: String,
    description: String,
    location: String
})

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    allTags: {
        type: String
    },
    photos : {
        type: [photoSchema]
    }
})

const User = models.User17 || model('User17', userSchema, "users");

export default User;