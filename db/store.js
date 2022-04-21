const util = require("util");
const fs = require("fs");
const uuid = require('connect-uuid');

const readFiles = util.promisify(fs.readFile);
const writeFiles = util.promisify(fs.writeFile);



class Store {
    read() {
        return readFiles("db/db.json", "utf8")
    }
    write(note) {
        return writeFiles("db/db.json", JSON.stringify(note))
    }

    addNotes(note) {
        const { title, text } = note

        if (!title || !text) {
            throw new Error("cannot be blank")
        }

        const newNote = { title, text, id: uuid() }

        return this.getAllNotes()
            .then(notes => [...notes, newNote])
            .then(updatedNote => this.write(updatedNote))
            .then(() => this.newNote)
    }

    getAllNotes() {
        return this.read()
            .then(notes => {
                return JSON.parse(notes) || [];
            })
    }
    
}

module.exports = new Store();