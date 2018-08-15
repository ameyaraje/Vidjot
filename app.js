const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

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

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
