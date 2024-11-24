const express = require('express');
const router = express.Router();

const moviesController = require('../controllers/movies');
const validation = require('../middleware/validate');
const isAuthenticated = require('../middleware/authenticate');

router.get('/', moviesController.getAll);

router.get('/:id', moviesController.getSingle);

router.post('/', isAuthenticated, validation.saveMovie, moviesController.createMovie);

router.put('/:id', isAuthenticated, validation.saveMovie, moviesController.updateMovie);

router.delete('/:id', isAuthenticated, moviesController.deleteMovie);

module.exports = router;
