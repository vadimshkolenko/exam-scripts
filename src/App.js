import React, { useState, useEffect } from 'react'
import { AddNoteForm } from './forms/AddNoteForm'
import { NoteTable } from './tables/NoteTable'
import { EditNoteForm } from './forms/EditNoteForm'
import './App.css'
import { Route, NavLink } from 'react-router-dom';
import './firebaseConfig/firebaseConfig'
import * as firebase from 'firebase'
import _ from 'lodash'

const App = () => {
    const db = firebase.firestore()

    const [notes, setNotes] = useState([])

    useEffect(() => {
        db.collection("notesData").onSnapshot(snapshot => {
            const notesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            // setNotes(notesData)
            setNotes(_.orderBy(notesData, sortConfig.sortField, 'asc'))
            console.log(notesData)
        })
    }, [])

    const [editing, setEditing] = useState(false)

    const initialFormState = { id: null, text: '', dateCreate: '', dateEnd: '' }
    const [currentNote, setCurrentNote] = useState(initialFormState)

    const addNote = note => {

        if (notes.length > 0) {
            note.id = notes[notes.length - 1].id + 1
        } else note.id = 1

        let now = new Date()
        note.dateCreate = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1}-${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`

        db.collection("notesData").doc(`${note.id}`).set({
            id: note.id,
            text: note.text,
            dateCreate: note.dateCreate,
            dateEnd: note.dateEnd
        })
    }

    const deleteNote = id => {
        setEditing(false)
        setNotes(notes.filter(note => note.id !== id))
        db.collection("notesData").doc(`${id}`).delete()
    }

    const updateNote = (id, updatedNote) => {
        setEditing(false)
        setNotes(notes.map(note => (note.id === id ? updatedNote : note)))
        db.collection("notesData").doc(`${id}`).update({
            id: updatedNote.id,
            text: updatedNote.text,
            dateCreate: updatedNote.dateCreate,
            dateEnd: updatedNote.dateEnd
        })
    }

    const editRow = note => {
        setEditing(true)
        setCurrentNote({ id: note.id, text: note.text, dateCreate: note.dateCreate, dateEnd: note.dateEnd })
    }

    // Сортировка
    const [sortConfig, setSortConfig] = useState({ sort: 'asc', sortField: 'dateCreate' })

    const onSort = sortField => {
        const cloneData = notes.concat()
        const sortType = sortConfig.sort === 'asc' ? 'desc' : 'asc'
        const orderedData = _.orderBy(cloneData, sortField, sortType)

        setNotes(orderedData)
        setSortConfig({ sort: sortType, sortField })
    }

    return (
        <div>
            <header>
                <NavLink exact to="/" activeClassName="activeLink">Мои заметки</NavLink>
                <NavLink to="/add-note" activeClassName="activeLink">Создать &#9998;</NavLink>
            </header>
            <Route path="/add-note" render={() =>
                <AddNoteForm addNote={addNote} />}
            />
            <Route exact path="/edit-note" render={() =>
                <EditNoteForm
                    editing={editing}
                    setEditing={setEditing}
                    currentNote={currentNote}
                    updateNote={updateNote}
                />}
            />
            <Route exact path="/" render={() =>
                <NoteTable
                    notes={notes}
                    deleteNote={deleteNote}
                    editRow={editRow}
                    onSort={onSort}
                    sort={sortConfig.sort}
                    sortField={sortConfig.sortField}
                />}
            />
        </div>
    )
}

export { App }