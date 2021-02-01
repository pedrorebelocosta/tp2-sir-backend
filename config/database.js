const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGODB_URI);

mongoose.Promise = global.Promise;
module.exports = mongoose;
