const express = require('express');
const router = express.Router();

const movieGendersController = require('../controllers/movie_genders');
const validation = require('../middleware/validate');
const isAuthenticated = require('../middleware/authenticate');

router.get('/', movieGendersController.getAll);

router.get('/:id', movieGendersController.getSingle);

router.post('/', isAuthenticated, validation.saveMovieGender, movieGendersController.createMovieGender);

router.put('/:id', isAuthenticated, validation.saveMovieGender, movieGendersController.updateMovieGender);

router.delete('/:id', isAuthenticated, movieGendersController.deleteMovieGender);

module.exports = router;
