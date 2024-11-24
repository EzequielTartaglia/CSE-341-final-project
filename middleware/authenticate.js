const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send('You are not authenticated. Please log in.');
    } else {
      return next();
    }
  };
  
  module.exports = isAuthenticated;