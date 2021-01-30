const User = require('../models/User');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = {
	create: function (req, res, next) {
		const email = req.body.email;
		const password = req.body.password;
		const firstname = req.body.firstname;
		const lastname = req.body.lastname;

		// if (_.isNil(email) && _.isNil(password)) {
		//	res.status(400).json({ message: "Username and password must be supplied!" })
		//	return;
		// }

		const newUser = new User(
			{ email, firstname, lastname, password }
		);

		User.findOne({ email }, function (err, docs) {
			if (err) next();
			if (!(_.isNull(docs))) {
				res.status(400).json({ message: "Email already exists!"})
				return;
			} else {
				User.create(newUser, (err, doc) => {
					if(err) next(err)
					res.status(201).end();
				});
			}
		});
	},
	read: function(req, res, next) {
		/*
			When reading Profile Data, only send visible Personal info
			email and password will be excluded.
		*/
		console.log(req.headers.authorization);
		res.status(200).end();
	},
	update: function(req, res, next) {
		/* 
			Business Rule:
			This action should verify if the user to delete
			matches the ID on the JWT
		*/
		res.status(200).end();
	},
	delete: function(req, res, next) {
		/* 
			Business Rule:
			This action should verify if the user to delete
			matches the ID on the JWT
		*/
		res.status(200).end();
	}
}
