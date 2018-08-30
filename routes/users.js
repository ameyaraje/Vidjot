const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const router = express.Router();
// const passport = require('passport');

module.exports = router;

// Load User Model
require('../models/user');
const User = mongoose.model('users');

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
        errors.push({ text: 'Passwords do not match' });
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email
        });
    }
    else {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'Successfuly registered');
                        res.redirect('users/login')
                            .catch(err => {
                                console.log(err);
                                return;
                            });
                    })
            });
        });
        res.send('REGISTERED');
    }
});