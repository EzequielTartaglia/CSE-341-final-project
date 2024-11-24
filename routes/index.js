const express = require('express');
const passport = require('passport');
const routes = express.Router();
const isAuthenticated = require('../middleware/authenticate');

// Swagger and other routes
routes.use('/', require('./swagger'));
routes.use('/movies', require('./movies'));
routes.use('/movie_genders', require('./movie_genders'));

// Home route: checks if user is logged in
routes.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(`You are logged in as: ${req.user.emails && req.user.emails[0].value}. Welcome back!`);
    } else {
      res.send('You are not logged in. Please log in by going to the /login route.');
    }
  });  

// Login route (this will trigger the GitHub OAuth flow)
routes.get('/login', passport.authenticate('github'));
  
// Logout route (clears the session and redirects to login)
routes.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Logout failed.');
    }
    res.send('You have logged out successfully.');
  });
});

// Protected route example (use isAuthenticated middleware)
routes.get('/api-docs', isAuthenticated, (req, res) => {
  res.send(`Welcome, ${req.user.displayName}`);
});

module.exports = routes;
