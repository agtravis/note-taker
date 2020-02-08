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

// let notes = '';

// readFileAsync('./db.json', 'utf8', (err, data) => {
//   if (err) throw err;
//   notes = data;
//   console.log(notes);
// });

// =============================================================
// Routes
// =============================================================

app.get('/assets/css/styles.css', (req, res) =>
  res.sendFile(path.join(__dirname, '/assets/css/styles.css'))
);
app.get('/assets/js/index.js', (req, res) =>
  res.sendFile(path.join(__dirname, '/assets/js/index.js'))
);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'notes.html'))
);

app.get('/api/notes', (req, res) => {
  let notes = '';
  readFileAsync('./db.json', 'utf8', (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
    res.json(notes);
  });
});

// =============================================================
// Listener
// =============================================================

app.listen(PORT, () => console.log('App listening on PORT ' + PORT));
