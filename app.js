const app = require('./config/bootstrap').default;

const AuthController = require('./controllers/AuthController');
const ProfileController = require('./controllers/ProfileController');

// Authentication and Authorization
app.post('/auth', AuthController.authenticate);
app.post('/register', AuthController.create);
app.post('/forgot', AuthController.forgot);

// User profile CRUD
app.post('/profile', ProfileController.create);
app.get('/profile/:id', ProfileController.read);
app.put('/profile/:id', ProfileController.update);
app.delete('/profile/:id', ProfileController.delete);

app.listen(4000, () => {
	console.log('API has started');
});
