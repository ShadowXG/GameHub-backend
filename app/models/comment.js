const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // replies: [replySchema]
}, {timestamps: true })

module.exports = commentSchema