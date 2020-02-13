'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000; //process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
    for (const note of notes) {
      if (!note.id) {
        note.id = note.title.replace(/ +/g, '-');
      }
    }
    fs.writeFile('./db.json', JSON.stringify(notes), 'utf8', err => {
      if (err) throw err;
    });
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  let notes = '';
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
    notes.push(newNote);
    for (const note of notes) {
      if (!note.id) {
        note.id = note.title.replace(/ +/g, '-');
      }
    }
    fs.writeFile('./db.json', JSON.stringify(notes), 'utf8', err => {
      if (err) throw err;
    });
  });
  res.sendFile(path.join(__dirname, 'notes.html'));
});

app.delete('/api/notes/:id', (req, res) => {
  const item = req.params.id;
  let notes = '';
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);
    for (const note of notes) {
      if (note.id === item) {
        notes.splice(notes.indexOf(note), 1);
      }
    }
    fs.writeFile('./db.json', JSON.stringify(notes), 'utf8', err => {
      if (err) throw err;
    });
  });
  res.sendFile(path.join(__dirname, 'notes.html'));
});

app.get('/*', function(req, res) {
  res.send(
    `<h1>404 error! ${req.protocol}://${req.get('host')}${
      req.path
    } does not exist! Better luck next time!</h1>`
  );
});

app.listen(PORT, () => console.log('App listening on PORT ' + PORT));
