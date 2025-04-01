const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        required: true
    },
    postWriter: {
        type: String,
        required: true
    },
    postContent: {
        type: String,
        required: true
    },
    postEmail: {
        type: String

    },
    postComment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
    ]
})

const Post = mongoose.model('Post', postSchema)
module.exports = Post