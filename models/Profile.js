const mongoose = require('mongoose');

const Profile = new mongoose.Schema({
	_userid: {
		type: mongoose.Types.ObjectId,
		required: true
	},
	firstname: {
		type: String,
		trim: true,
		required: true
	},
	lastname: {
		type: String,
		trim: false,
		required: true
	},
	posts: {
		type: Array,
		default: [],
		required: true
	},
	likes: {
		type: Array,
		default: [],
		required: true
	}
});

module.exports = mongoose.model('Profile', Profile, 'profiles');
