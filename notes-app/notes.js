const fs = require("fs")
const chalk = require("chalk");

const getNotes = () => {
    return "My notes...";
}

const addNote = (title, body) => {
    const notes = loadNotes();
    const duplicateNote = notes.find((note) => note.title === title)

    debugger

    if (!duplicateNote) {
        notes.push({
            title,
            body
        })
        saveNotes(notes);
        console.log(chalk.green.inverse("New note added"))
    } else {
        console.log(chalk.red.inverse("The note taken!"))
    }
}

const removeNote = (title) => {
    const notes = loadNotes()
    const keepNotes = notes.filter((note) => note.title != title)
    if (notes.length > keepNotes.length) {
        console.log(chalk.green.inverse("Removed note!"))
        saveNotes(keepNotes)
    }
    else
        console.log(chalk.red.inverse("No note found!"))
}

const listNotes = () => {
    const notes = loadNotes()
    console.log(chalk.blue.inverse("My notes"))
    notes.forEach(note => console.log(note.title))
}

const readNote = (title) => {
    const notes = loadNotes()
    const findedNote = notes.find((note) => note.title === title)
    if (findedNote) {
        console.log(chalk.greenBright.inverse(findedNote.title) + " " + chalk.gray.inverse(findedNote.body))
    } else {
        console.log(chalk.red.inverse("Not found!"))
    }
}

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON)
}

const loadNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

module.exports = {
    getNotes,
    addNote,
    removeNote,
    listNotes,
    readNote
}