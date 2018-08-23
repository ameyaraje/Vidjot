const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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


// Middleware that can be used

// app.use(function(req, res, next){
// 	// console.log(Date.now());
// 	req.name = 'Some request';
// 	next();
// });

app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

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
		} );
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
			res.redirect('/ideas');
		});
	}
});

const port = 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
