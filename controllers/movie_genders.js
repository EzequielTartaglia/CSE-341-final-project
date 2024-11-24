const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = (req, res) => {
  mongodb
    .getDb()
    .db()
    .collection('movie_genders')
    .find()
    .toArray((err, lists) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
};

const getSingle = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid movie gender id to find a movies.');
  }
  const movieGenderId = new ObjectId(req.params.id);
  mongodb
    .getDb()
    .db()
    .collection('movie_genders')
    .find({ _id: movieGenderId })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};

const createMovieGender = async (req, res) => {
  const movieGender = {
    movie_gender_id: req.body.movie_gender_id,
    name: req.body.name,
    description: req.body.description 
  };
  const response = await mongodb.getDb().db().collection('movie_genders').insertOne(movieGender);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the movie gender.');
  }
};

const updateMovieGender = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid movie id to update a movie gender.');
  }
  const movieGenderId = new ObjectId(req.params.id);

  const movieGender = {
    movie_gender_id: req.body.movie_gender_id,
    name: req.body.name,
    description: req.body.description
  };

  const response = await mongodb
    .getDb()
    .db()
    .collection('movie_genders')
    .replaceOne({ _id: movieGenderId }, movieGender);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the movie gender.');
  }
};

const deleteMovieGender = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid movie gender id to delete a movie gender.');
  }
  const movieGenderId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('movie_genders').remove({ _id: movieGenderId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the movie gender.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createMovieGender,
  updateMovieGender,
  deleteMovieGender
};
