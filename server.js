'use strict';

const express = require('express');
const path = require('path');
const util = require('util');
const fs = require('fs');
const readFile = fs.readFile;

const readFileAsync = util.promisify(readFile);

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let notes = '';

readFileAsync('./db.json', 'utf8', (err, data) => {
  if (err) throw err;
  notes = data;
  console.log(notes);
});

// =============================================================
// Routes
// =============================================================

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'notes.html'))
);

// // Create New Characters - takes in JSON input
// app.post('/api/characters', (req, res) => {
//   // req.body hosts is equal to the JSON post sent from the user
//   // This works because of our body parsing middleware
//   const newCharacter = req.body;

//   // Using a RegEx Pattern to remove spaces from newCharacter
//   // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
//   newCharacter.routeName = newCharacter.name.replace(/\s+/g, '').toLowerCase();

//   console.log(newCharacter);

//   characters.push(newCharacter);

//   res.json(newCharacter);
// });

// =============================================================
// Listener
// =============================================================

app.listen(PORT, () => console.log('App listening on PORT ' + PORT));
