const mongoose = require('mongoose')

const commentSchema = require('./comment')
const favoriteSchema = require('./favorite')

const gameSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		genre: [{
			type: String,
			required: true,
		}],
		platform: [{
			type: String,
			required: true,
		}],
		favorites: [favoriteSchema],
		comments: [commentSchema],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Game', gameSchema)
