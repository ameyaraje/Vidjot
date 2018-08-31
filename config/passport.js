const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load user model
const User = mongoose.model('users');

module.exports = function () {
    passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Check for user
        User.findOne({
            email: email
        }).then(user => {
            if (!user) {
                return done(null, false, { message: 'No such user, please check your email and password' });
            }

            // Check password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'No such user, please check your email and password' });
                }
            });
        });
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}; 