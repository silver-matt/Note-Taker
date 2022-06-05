//required files
const express = require('express');
const path = require('path');
const dataBase = require('./db/db.json');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTML routes
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

// API routes for notes page
app.get('/api/notes', (req, res) => {
    res.json(dataBase.slice(1));
});

app.post('/api/notes', (req, res) => {
        const newNote = createNote(req.body, dataBase);
        res.json(newNote);
    })
    // Function to create new note and count Id for each note
const createNote = (body, notesArray) => {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray.length;
    notesArray[0]++;
    notesArray.push(newNote);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
};

app.delete('/api/notes/:id', (req, res) => {
        deleteNote(req.params.id, dataBase);
        res.json(true);
    })
    // Function that deletes notes if the user decided to
const deleteNote = (id, notesArray) => {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];
        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
            break;
        }
    }
};

// App listening at http://localhost:3001
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});