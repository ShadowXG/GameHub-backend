const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = commentSchema