const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session')

const app = express();

// Map global promise
mongoose.Promise = global.Promise;
// Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
	useMongoClient: true
})
	.then(() => console.log('MongoDB Connected!'))
	.catch(err => console.log('Error connecting to MongoDB'));

// Load IdeaModel
require('./models/idea');
const Idea = mongoose.model('ideas');

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

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

// Add all ideas
app.get('/ideas', (req, res) => {
	Idea.find({})
		.sort({ date: 'desc' })
		.then(ideas => {
			res.render('ideas/all', {
				ideas: ideas,
			});
		});
});

// Edit Idea form
app.get('/ideas/edit/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			res.render('ideas/edit', {
				idea: idea
			})
		});
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
	res.render('ideas/add');
});

// Process form
app.post('/ideas', (req, res) => {
	let errors = [];
	if (!req.body.title) {
		errors.push({ text: "Please add a title" });
	}
	if (!req.body.details) {
		errors.push({ text: "Please enter the details" });
	}
	if (errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details,
		};
		new Idea(newUser).save().then(idea => {
			req.flash('success_msg', 'Idea Added Successfully!');
			res.redirect('/ideas');
		});
	}
});

// Submit the edited form
app.put('/ideas/:id', (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			idea.title = req.body.title;
			idea.details = req.body.details;

			idea.save()
				.then(idea => {
					req.flash('success_msg', 'Idea Updated Successfully!');
					res.redirect('/ideas');
				});
		});
});

// Delete idea
app.delete('/ideas/:id', (req, res) => {
	Idea.remove({ _id: req.params.id })
		.then(() => {
			req.flash('success_msg', 'Idea Removed Successfully!');
			res.redirect('/ideas');
		});
});

const port = 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
