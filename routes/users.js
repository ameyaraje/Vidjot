const express = require('express');
const router = express.Router();

module.exports = router;

// User Login
router.get('/login', (req, res) => {
	res.render('users/login');
});

// User Register
router.get('/register', (req, res) => {
	res.render('users/register');
});

// Post the registered form
router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({text: 'Passwords do not match'});
    }
    if (errors.length > 0) {
        res.render('/users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });  
    }
    else {
        res.send('REGISTERED');
    }
});