require('dotenv').config({ path: `${__dirname}/.env`});;

const express = require('express');
const fileUpload = require('express-fileupload');
const ejwt = require('express-jwt');
const mongoose = require('./database');
const cors = require('cors');

const app = express();
app.use(express.static('files')).use(
	ejwt({
		secret: process.env.SECRET,
		algorithms: ['HS256']
	})
	.unless({ path: ['/auth', '/user/new', '/forgot', '/upload'] }));
	
app.use(fileUpload());
app.use(express.static('files'));

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(err.status).json(err);
	}
});

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(express.json());
app.use(cors());

module.exports = app;
