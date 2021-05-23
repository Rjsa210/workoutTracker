const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema ({
  //create exercise model
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
