//import express, mongoose

const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

const PORT = process.env.PORT || 3001;

// const Workout = require('./models/workoutModel.js');
const db = require('./models');
const app = express();

app.use(logger('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/workout', 
{ 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.get('/exercise', (req, res) => {
  res.sendFile(path.join(__dirname, './public/exercise.html'));
});

app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname, './public/stats.html'));
});

app.get('/api/workouts', (req, res) => {
  // db.Workout.find({})
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: {$sum: "$exercises.duration"}
      }
  }
])
    .then(dbWorkout => { 
      res.json(dbWorkout);
    })
    .catch(err => {
      console.log(err);
    })
})
app.post('/api/workouts', ({ body }, res) => {
  db.Workout.create({
      day: Date.now(),
    })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(({ message }) => {
      console.log(message);
    })
});

app.put('/api/workouts/:id', (req, res) => {
  db.Workout.findByIdAndUpdate(
    { _id: req.params.id },
    {$push: { exercises: {
      type: req.body.type,
      name: req.body.name,
      duration: req.body.duration,
      reps: req.body.reps,
      sets: req.body.sets,
      weight: req.body.weight,
      distance: req.body.distance
    }}},
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  )
});

//TODO: need to specify range
/*app.get('/api/workouts/range', (req, res) => {
  db.Workout.find({})
  .then(dbWorkout => {
    const lastSeven = [];
    for (i = dbWorkout.length - 7; i < dbWorkout.length; i++) {
    lastSeven.push(dbWorkout[i])
    }
    console.log(lastSeven)
    res.json(lastSeven);
  })
  .catch(err => {
    console.log(err);
  })
});*/

app.get('/api/workouts/range', (req, res) => {
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: {$sum: "$exercises.duration"}
      }
  }
])
  .then(dbWorkout => {
    const lastSeven = [];
    for (i = dbWorkout.length - 7; i < dbWorkout.length; i++) {
    lastSeven.push(dbWorkout[i])
    }
    console.log(lastSeven)
    res.json(lastSeven);
  
   })
  .catch(err => {
    console.log(err);
  })
});



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
}); 