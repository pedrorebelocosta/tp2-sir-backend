const app = require('./config/bootstrap').default;

const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');

// Authentication and Authorization
app.post('/auth', AuthController.authenticate);
app.post('/forgot', AuthController.forgot);

// User CRUD
/*
	To register a new user
	Request Body: email, password, firstname and lastname
	Returns HTTP Status Code 201 if the creation was successful
	Returns HTTP Status Code 400 if the email already exists
*/
app.post('/user/new', UserController.create);

/*
	Use case: get all data of currently logged in user (except password)
	Without their email and password
*/
app.get('/user/me', UserController.read);

/*
	To retrieve the publicly visible data of a user
	Endpoint requires ID (eg: /user/1239123912)
	Returns firstname, lastname, posts (array of ids) 
	and likedPosts (array of ids)
*/
app.get('/user/:id', UserController.read);

/*
	To update a user's data
	Request body: can be everything except different ID
	Returns 200 OK if changes are applied
	Returns 400 if not
*/
app.put('/user/me', UserController.update);

/*
	Delete the current user's profile
*/
app.delete('/user/me', UserController.delete);

// Post CRUD
// app.post('/post', PostController.create);
// app.get('/post', PostController.read);
// app.get('/post/:id', PostController.read);
// app.put('/post/:id', PostController.update);
// app.delete('/post/:id', PostController.delete);

app.listen(4000, () => {
	console.log('API has started');
});
