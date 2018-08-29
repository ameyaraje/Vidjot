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
