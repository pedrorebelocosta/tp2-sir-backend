const app = require('./config/bootstrap');

const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');

/*
	/auth authorizes the user and returns a JWT
	with a payload of the user if successfully authenticated
	/forgot not implemented yet (needs security verifications)
*/

app.post('/upload', function (req, res, next) {
	let sampleFile;
	let uploadPath;

	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	sampleFile = req.files.fileKey;
	filename = Date.now() + sampleFile.name;
	uploadPath = __dirname + '/files/' + filename;

	// Use the mv() method to place the file somewhere on your server
	sampleFile.mv(uploadPath, function (err) {
		if (err)
			return res.status(500).send(err);
		res.status(201).json({ url: `http://localhost:4000/${filename}`}); 
	});
});

app.post('/auth', AuthController.authenticate);
app.post('/forgot', AuthController.forgot);

/*
	To register a new user
	Request Body: email, password, firstname and lastname
	Returns HTTP Status Code 201 if the creation was successful
	Returns HTTP Status Code 400 if the email already exists
*/
app.post('/user/new', UserController.create);

/*
	To retrieve the publicly visible data of a user
	Endpoint requires ID (eg: /user/1239123912)
	Returns firstname, lastname, posts (array of ids) 
	and likedPosts (array of ids)
*/
app.get('/user/:id', UserController.read);
app.get('/user/:id/posts', UserController.readPosts);
app.get('/user/:id/likes', UserController.readLikes);

/*
	Use case: get all data of currently logged in user (except password)
	Without their email and password
*/
app.get('/user/me', UserController.read);
app.get('/user/me/posts', UserController.readPosts);
app.get('/user/me/likes', UserController.readLikes);


/*
	To update a user's data
	Request body: can be everything except different ID
	Returns 200 OK if changes are applied
	Returns 400 if not
*/
app.put('/user/me', UserController.update);

/*
	Delete the current user's profile
	Returns 202 if user was successfuly deleted
*/
app.delete('/user/me', UserController.delete);

// Post CRUD
app.post('/post', PostController.create);
app.post('/post/:id/likes', PostController.createLike);

app.get('/post', PostController.read);
app.get('/post/:id', PostController.read);
app.get('/post/:id/likes', PostController.readLikes);

app.put('/post/:id', PostController.update);
app.delete('/post/:id', PostController.delete);
app.delete('/post/:id/likes', PostController.deleteLikes);

app.listen(4000, () => {
	console.log('API has started');
});
