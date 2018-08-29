const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');

const app = express();

// Load Routes

const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Map global promise
mongoose.Promise = global.Promise;
// Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
	useMongoClient: true
})
	.then(() => console.log('MongoDB Connected!'))
	.catch(err => console.log('Error connecting to MongoDB'));


// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
}));

app.use(flash());

app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// Global variables
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

app.get('/', (req, res) => {
	const name = 'Ameya';
	res.render('index', {
		name: name
	});
	// console.log(req.name);
});

app.get('/about', (req, res) => {
	res.render('about');
});


// Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
