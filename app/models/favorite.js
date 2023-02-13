const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema({
    favs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true })

module.exports = favoriteSchema