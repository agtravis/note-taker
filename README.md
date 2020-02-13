# Note-Taker App

This app takes user input and permanently stores it using a `.json` file. It is hosted at `Heroku` via `GitHub` with automatic deployment enabled.

Check out the repo [here](https://github.com/agtravis/note-taker), and see the deployed app [here](https://agtravis-note-taker.herokuapp.com/).

This app runs in the browser.

## Table of contents

- [General info](#general-info)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Code Examples](#code-examples)
- [Setup](#setup)
- [Features](#features)
- [Status](#status)
- [Contact](#contact)

## General info

The main function of this app is to keep track of a 'to-do' list, or creative ideas, musings, or anything else the user wants to keep track of. The user can add items to the list as long as they have access to the internet, and as they complete the task or no longer need the note, they can delete the note.

## Screenshots

![CLI](https://github.com/agtravis/node-resume-generator/blob/master/assets/images/CLI.PNG)
![finished](https://github.com/agtravis/node-resume-generator/blob/master/assets/images/output.PNG)

## Technologies

This package was written in JavaScript using Node.js, and is based around the npm package `Express`. If the GitHub repo is forked, in order to edit the code the user can run `npm i` to install this dependency.

The entry point for this app is `server.js`. On load, this file requires the modules for `express`, `fs`, and `path`, calls `express` into the variable `app`, and then sets the URL encoding and json features using `app.use`.

Next some routes are defined. Since the front end was created by someone other than myself and I wrote the back end to align with it, I set a route to align with each of the `CSS` and `JavaScript` external files.

There are only 2 routes that deliver `get` responses that respond with a webpage, the main (`/`) and the atual app renders the functions at the route `/notes`. There is also a route that handles everything else that might be entered to direct the user to a `404 not found` page.

There are then 3 different routes for interacting with the API, these will be detailed in the Code Examples below.

Finally, the app listens to a port which is defined as `process.env.PORT` so that it can upload to Heroku.

## Code Examples

'GET':

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

This route first establishes an empty variable to be an empty string. Next it reads the JSON file and writes the content into the variable as a JSON object. If a nested object of the JSON object does not contain a specific property 'id', it is assigned based on the text contained in the title. Later in the code, this id is going to be passed in the URL, so a `replace` method is run on the text (using `regex`) to ensure that all space characters are replaced with a hyphen. This is then written as a new file that overwrites the existing file, and then the HTML file is sent to the browser - The HTML file has JavaScript that calls the API to populate the page with the notes being 'stored' in the JSON file (the JSON file is acting as a pseudo-database).

'POST':

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

The POST request routing is almost the same as the GET. This is because it is still reading the file and writing the file, but in between these two `fs` functions, it is inserting a new object passed to it from the AJAX POST request.

'DELETE':

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

In the routing for the DELETE request, a parameter is sent back to the handling. This is the variable that is used to make sure the correct object from the JSON response is deleted, before the file is written again. Since this is taken from the object storing the content that the HTML is displaying, I have written the code to ensure that the property value is in a format that can be passed through the URL.

Once the data has been accessed, a `for...of` loop runs on it which checks each object to see if the id property matches the id that has been passed. Once that has been matched, it is removed from the array, and the document is rewritten and then passed to the browser.

## Setup

Nothing is stored on the user's device, so they will see the same list however they access the app. To use it they simply visit the URL https://agtravis-note-taker.herokuapp.com/.

## Features

## Status

### Future Developement

## Contact

Created by [@agtravis](https://agtravis.github.io/)
