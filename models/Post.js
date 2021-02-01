const mongoose = require('mongoose');

const Post = new mongoose.Schema({
	author: {
		type: mongoose.Types.ObjectId,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	photoUrl: {
		type: String,
		required: true
	},
	likes: {
		type: Array,
		default: [],
		required: false
	}
});

module.exports = mongoose.model('Post', Post, 'posts');
