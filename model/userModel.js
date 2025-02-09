const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    likes: [
       { blogId: {type: Schema.Types.ObjectId}, _id: false}
    ],
    posts: [
        { postId: {type: Schema.Types.ObjectId}, _id: false}
    ],
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number
    },
    refreshToken: String
},
{timestamps: true}
)

module.exports = mongoose.model('User', userSchema)