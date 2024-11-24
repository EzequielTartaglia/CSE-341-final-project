const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = (req, res) => {
  mongodb
    .getDb()
    .db()
    .collection('directors')
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
    res.status(400).json('Must use a valid director id to find a director.');
  }
  const directorId = new ObjectId(req.params.id);
  mongodb
    .getDb()
    .db()
    .collection('directors')
    .find({ _id: directorId })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};

const createDirector = async (req, res) => {
  const director = {
    director_id: req.body.director_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  };
  const response = await mongodb.getDb().db().collection('directors').insertOne(director);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the director.');
  }
};

const updateDirector = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid director id to find a directors.');
  }
  const directorId = new ObjectId(req.params.id);

  const updateData = {
    director_id: req.body.director_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name
  };

  Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

  mongodb
    .getDb()
    .db()
    .collection('directors')
    .updateOne({ _id: directorId }, { $set: updateData }, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error trying to update director' });
      }

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Director not found.' });
      }

      res.status(200).json({ message: 'Director successfully updated.' });
    });
};

const deleteDirector = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid director id to delete a director.');
  }
  const directorId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('directors').remove({ _id: directorId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the director.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createDirector,
  updateDirector,
  deleteDirector
};
