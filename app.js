const app = require('./config/bootstrap');

const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');

// Authentication and Authorization
app.post('/auth', AuthController.authenticate);
app.post('/forgot', AuthController.forgot);

// User CRUD
app.post('/user/new', UserController.create);
app.get('/user/:id', UserController.read);
app.put('/user/:id', UserController.update);
app.delete('/user/:id', UserController.delete);

app.listen(4000, () => {
	console.log('API has started');
});
