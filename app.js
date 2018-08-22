const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

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

// Add Idea Form
app.get('/ideas/add', (req, res) => {
	res.render('/ideas/add');
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
