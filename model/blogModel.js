const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    like: {
        type: Number,
        default: 0
    },
    comments: [
        { 
            userId: Schema.Types.ObjectId,
            message: String,
            _id: false
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
},
{timestamps: true}
)

module.exports = mongoose.model('Blog', blogSchema)