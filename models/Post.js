const mongoose = require('mongoose');

const Post = new mongoose.Schema({
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
		required: true
	}
});

module.exports = mongoose.model('Post', Post, 'posts');
