import { Schema, model, models } from "mongoose";

const photoSchema = new Schema({
    key: String,
    tags: [String],
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
    allTags: [[String, Number]],
    photos : [photoSchema]
})

const User = models.User26 || model('User26', userSchema, "users");

export default User;