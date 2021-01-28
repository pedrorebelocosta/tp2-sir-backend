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
	password: {
		type: String,
		trim: true,
		required: true
	},
});

User.pre('save', function (next) {
	const user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();
	// generate a salt
	const salt = bcrypt.genSaltSync(SALT_ROUNDS);
	// hash the password using our new salt
	user.password = bcrypt.hashSync(user.password, salt);
	next();
});

module.exports = mongoose.model('User', User, 'users');
