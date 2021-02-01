const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const User = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		required: true,
		index: { unique: true }
	},
	firstname: {
		type: String,
		trim: true,
		required: false
	},
	lastname: {
		type: String,
		trim: true,
		required: false
	},
	password: {
		type: String,
		trim: true,
		required: true
	},
	picture: {
		type: String,
		trim: true,
		required: false,
		default: ""
	},
	posts: {
		type: Array,
		default: [],
		required: false
	},
	likedPosts: {
		type: Array,
		default: [],
		required: false
	}
});

User.pre('save', function (next) {
	// only hash the password if it has been modified (or is new)
	if (!this.isModified('password')) return next();
	// generate a salt
	const salt = bcrypt.genSaltSync(SALT_ROUNDS);
	// hash the password using our new salt
	this.password = bcrypt.hashSync(this.password, salt);
	next();
});

module.exports = mongoose.model('User', User, 'users');
