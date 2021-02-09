const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = {
	authenticate: function (req, res, next) {
		const email = req.body.email;
		const password = req.body.password;
		
		if (_.isNil(email) && _.isNil(password)) {
			res.status(400).json({ message: "Username and password must be supplied!" })
			return;
		}

		User.findOne({ email }, function (err, user) {
			if (err) next();
			if (_.isNull(user)) {
				res.status(404).json({ message: "User not found" });
				return;
			} else {
				if (bcrypt.compareSync(password, user.password)) {
					const token = jwt.sign({
						_id: user._id,
						email: user.email,
						firstname: user.firstname,
						lastname: user.lastname 
					}, process.env.SECRET, { expiresIn: '1h' });
					res.status(200).send({ auth: true, token: token });
				} else {
					res.status(400).json({ status: "error", message: "Incorrect email/password" });
					return;
				}
			}
		});
	},
	forgot: function (req, res, next) {
		/*
			Expects to receive an email address
			Send a password reset link (nodemailer) with a randomly generated PIN
			Angular front-end: receives a link with a base64 encoded AES cipher,
			decodes base64 AES, decrypts message with PIN, password reset should show up
		*/
		res.status(200).end();
	}
}
