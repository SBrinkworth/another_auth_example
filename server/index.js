// EXTERNAL MODULES //
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session');

// CONFIG //
const config = require('./config');

// APP //
var app = module.exports = express();

app.use(express.static(__dirname + './../public'));
app.use(bodyParser.json());
app.use(cors());

var massiveServer = massive.connectSync({
  connectionString: config.MASSIVE_URI
});

app.set('db', massiveServer);
var db = app.get('db');

// CONTROLLERS //
var authCtrl = require('./controllers/userCtrl');

// POLICIES //
var passport = require('./services/passport');
var isAuthed = function(req, res, next) {
	if (!req.isAuthenticated()) return res.status(401)
		.send();
	return next();
};

var isAdmin = function(req, res, next) {
	if (req.user.admin) {
		next();
	} else {
		return res.status(401)
			.send();
	}
};

// Session and passport //
app.use(session({
	secret: config.SESSION_SECRET,
	saveUninitialized: false,
	resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Endpoints //
app.post('/api/login', passport.authenticate('local', {
	successRedirect: '/api/me'
}));
app.get('/api/logout', function(req, res, next) {
	req.logout();
	return res.status(200)
		.send('logged out');
});

app.post('/api/register', authCtrl.register);
app.get('/api/user', authCtrl.read);
app.get('/api/me', isAuthed, authCtrl.me);
app.put('/api/user/current', isAuthed, authCtrl.update);

app.listen(config.PORT, function() {
  console.log('Listening on port ', config.PORT);
})
