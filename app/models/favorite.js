const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {timestamps: true })

module.exports = mongoose.model('Favorite', favoriteSchema)