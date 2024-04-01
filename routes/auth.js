const express = require('express');
const router = express.Router();
const passport = require('passport');

// Redirect the user to GitHub for authentication. When complete, GitHub
// will redirect the user back to the application at /auth/github/callback
router.get('/github', passport.authenticate('github'));

// GitHub will redirect the user to this URL after authentication has succeeded or failed.
// The second parameter to passport.authenticate() is the options object where you can define the failureRedirect.
// This route is also where you would handle successful authentication, for example by redirecting the user to another page.
router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

module.exports = router;
