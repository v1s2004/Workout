var express = require('express');
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

// User model
const User = require('../models/user'); 

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/users/login');
}

// Middleware to check if the user is logged out
function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('/');
}

/* GET users listing. */
router.get('/', isLoggedIn, function(req, res, next) {
    res.send('respond with a resource');
});

/* GET user registration page. */
router.get('/register', isLoggedOut, function(req, res, next) {
    res.render('register'); 
});

/* POST user registration. */
router.post('/register', isLoggedOut, function(req, res, next) {
    const { username, email, password } = req.body;
    // Hash the password and create a new user
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;
        new User({
            username,
            email,
            password: hashedPassword
        }).save()
        .then(user => {
            res.redirect('/users/login');
        })
        .catch(err => console.log(err));
    });
});

/* GET user login page. */
router.get('/login', isLoggedOut, function(req, res, next) {
    res.render('login'); // Ensure there is a 'login.hbs' file in your 'views' directory
});

/* POST user login. */
router.post('/login', isLoggedOut, passport.authenticate('local', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login',
    failureFlash: true // You must configure flash messages in your app to use this
}));

/* GET user profile page. */
router.get('/profile', isLoggedIn, function(req, res, next) {
    // Pass the logged-in user's data to the profile view
    res.render('profile', { user: req.user }); // Ensure there is a 'profile.hbs' file in your 'views' directory
});

/* GET user logout. */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/users/login');
});

module.exports = router;
