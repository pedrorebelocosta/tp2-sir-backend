require('dotenv').config({ path: `${__dirname}/.env`});;

const express = require('express');
const ejwt = require('express-jwt');
const mongoose = require('./database');

const app = express();

app.use(
	ejwt({
		secret: process.env.SECRET,
		algorithms: ['HS256']
	}).unless({ path: ['/auth', '/register', '/forgot'] })
);

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(err.status).json(err);
	}
});

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
exports.default = app;
