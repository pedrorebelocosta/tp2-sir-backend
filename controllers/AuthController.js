const User = require('../models/User');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = {
	create: function (req, res, next) {
		const email = req.body.email;
		const password = req.body.password;
		
		if (_.isNil(email) && _.isNil(password)) {
			res.status(400).json({ message: "Username and password must be supplied!" })
			return;
		}

		const newUser = new User(
			{ email: req.body.email, password: req.body.password }
		);

		User.findOne({ email: newUser.email }, function (err, docs) {
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
					const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1h' });
					res.status(200).send({ auth: true, token: token });
				} else {
					res.json({ status: "error", message: "Incorrect email/password" });
					return;
				}
			}
		});
	},
	forgot: function (req, res, next) {
		// TODO implement forgot password function
		res.status(200).end();
	}
}
