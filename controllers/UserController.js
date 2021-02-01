const User = require('../models/User');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const EXCLUDE_FIELDS = { email: 0, password: 0 };

module.exports = {
	create: function (req, res, next) {
		const email = req.body.email;
		const password = req.body.password;
		const firstname = req.body.firstname;
		const lastname = req.body.lastname;

		// if (_.isNil(email) && _.isNil(password)) {
		// 	res.status(400).json({ message: "Username and password must be supplied!" })
		// 	return;
		// }

		const newUser = new User(
			{ email, firstname, lastname, password }
		);

		User.findOne({ email }, (err, docs) => {
			if (err) next();
			if (!(_.isNull(docs))) {
				res.status(400).json({ message: "Email already exists!"})
				return;
			} else {
				User.create(newUser, (err, doc) => {
					if(err) next(err);
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
		const requestedMe = req.originalUrl === '/user/me' ? true : false;
		const authHeader = req.headers.authorization;
		const decodedToken = jwt.decode(authHeader.split(' ')[1]);

		if (requestedMe) {
			User.findOne({ _id: decodedToken._id }, EXCLUDE_FIELDS,
				(err, docs) => {
					if (err) return next();
					if (docs) res.status(200).json(docs);
				}
			);
		} else {
			const requestedUserID = req.params.id;
			if (!requestedUserID) return;
			User.findOne({ _id: requestedUserID }, EXCLUDE_FIELDS,
				(err, docs) => {
					if (err) return next();
					if (docs) res.status(200).json(docs);
				}
			);
		}
	},
	update: async function(req, res, next) {
		/* 
			This method updates the current user
			Will not return the email and password
			matches the ID on the JWT
		*/
		const authHeader = req.headers.authorization;
		const decodedToken = jwt.decode(authHeader.split(' ')[1]);
		if (!req.body) return res.status(400).end();
		
		const updatedUser = await User.findOneAndUpdate(
			{ _id: decodedToken._id }, req.body,
			{ new: true, fields: EXCLUDE_FIELDS
		});

		if (!updatedUser) return res.status(500).end();
		res.status(200).json(updatedUser);
	},
	delete: function(req, res, next) {
		/* 
			This method deletes the current user
			Returns 202 Accepted if user is successfully deleted
		*/
		const authHeader = req.headers.authorization;
		const decodedToken = jwt.decode(authHeader.split(' ')[1]);

		User.findOneAndRemove(
			{ _id: decodedToken._id }, EXCLUDE_FIELDS,
			(err, docs) => { 
				if (err) return next(err);
				return res.status(202).json(docs);
			}
		);
	}
}
