const fs = require("fs");
const path = require("path")
const express = require("express");
const logger = require("morgan")
const { v4: uuidv4 } = require("uuid")
const app = express();
const PORT = process.env.PORT || 8080;

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))
app.use(logger("dev"));

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/public/index.html");

});


//View all notes
app.get("/api/notes", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {

        const notes = JSON.parse(data)

        res.json(notes)
    });
});

//POST - add new notes
app.post("/api/notes", function (req, res) {
    const note = {
        id: uuidv4(),
        ...req.body,
    };

    fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {
        const notes = JSON.parse(data);
        notes.push(note);

        const stringifiedData = JSON.stringify(notes, null, 2);

        fs.writeFile(__dirname + "/db/db.json", stringifiedData, function () {
           res.json(note);
        });
    });


   
});

//DELETE
app.delete("/api/notes/:id", async function (req, res) {
    try {
    const { id } = req.params;
    
    
    const data = await fs.promises.readFile(__dirname + "/db/db.json", "utf8");

    let notes = JSON.parse(data);

    notes = notes.filter((note) => note.id !== id);
        console.log(notes)
    const stringifiedData = JSON.stringify(notes, null, 2);

    await fs.promises.writeFile(__dirname + "/db/db.json", stringifiedData)
        res.json(true);
    } catch (err){
        res.status(500).end();
    }
});

//load notes.html
app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname + "/public/notes.html"))
});

//PUT GET * HERE
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/public/index.html")
});
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);