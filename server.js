'use strict';

const express = require('express');
const path = require('path');
const util = require('util');
const fs = require('fs');
const readFile = fs.readFile;
const writeFile = fs.writeFile;

const readFileAsync = util.promisify(readFile);
const writeFileAsync = util.promisify(writeFile);

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
    for (const note of notes) {
      if (!note.id) {
        note.id = note.title.replace(/ +/g, '-');
      }
    }
    writeFileAsync('./db.json', JSON.stringify(notes), 'utf8', err => {
      if (err) throw err;
    });
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  let notes = '';
  readFileAsync('./db.json', 'utf8', (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
    notes.push(newNote);
    for (const note of notes) {
      if (!note.id) {
        note.id = note.title.replace(/ +/g, '-');
      }
    }
    writeFileAsync('./db.json', JSON.stringify(notes), 'utf8', err => {
      if (err) throw err;
    });
  });
  res.sendFile(path.join(__dirname, 'notes.html'));
});

app.delete('/api/notes/:id', (req, res) => {
  const item = req.params.id;
  let notes = '';
  readFileAsync('./db.json', 'utf8', (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
    for (const note of notes) {
      if (note.id === item) {
        notes.splice(notes.indexOf(note), 1);
      }
    }
    writeFileAsync('./db.json', JSON.stringify(notes), 'utf8', err => {
      if (err) throw err;
    });
  });
  res.sendFile(path.join(__dirname, 'notes.html'));
});

// =============================================================
// Listener
// =============================================================

app.listen(PORT, () => console.log('App listening on PORT ' + PORT));
