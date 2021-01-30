const app = require('./config/bootstrap');

const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');

// Authentication and Authorization
app.post('/auth', AuthController.authenticate);
app.post('/forgot', AuthController.forgot);

// User CRUD
app.post('/user/new', UserController.create);
app.get('/user', UserController.read);
app.get('/user/:id', UserController.read);
app.put('/user/:id', UserController.update);
app.delete('/user/:id', UserController.delete);

// Post CRUD
// app.post('/post', PostController.create);
// app.get('/post', PostController.read);
// app.get('/post/:id', PostController.read);
// app.put('/post/:id', PostController.update);
// app.delete('/post/:id', PostController.delete);

app.listen(4000, () => {
	console.log('API has started');
});
