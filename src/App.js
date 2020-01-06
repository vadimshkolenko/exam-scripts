import React, { useState, useEffect } from 'react'
import { AddNoteForm } from './forms/AddNoteForm'
import { NoteTable } from './tables/NoteTable'
import { EditNoteForm } from './forms/EditNoteForm'
import './App.css'
import { Route, NavLink } from 'react-router-dom';
import './firebaseConfig/firebaseConfig'
import * as firebase from 'firebase'

const App = () => {
    const db = firebase.firestore()

    const [notes, setNotes] = useState([])

    useEffect(() => {
        db.collection("notesData").onSnapshot(snapshot => {
            const notesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setNotes(notesData)
            console.log(notesData)
        })
    }, [])

    // флаг editing - изначально false, функция установки флага
    const [editing, setEditing] = useState(false)

    // начальное значение для формы редактирования
    // так как мы не знаем, кто редактируется - пустые поля
    const initialFormState = { id: null, text: '', dateCreate: '', dateEnd: '' }
    // значение "текущий пользователь на редактировании" + функция установки этого значения
    const [currentNote, setCurrentNote] = useState(initialFormState)

    const addNote = note => {

        if (notes.length > 0) {
            note.id = notes[notes.length - 1].id + 1
        } else note.id = 1
        // вызываем setUsers определенную выше в хуке useState
        // передаем туда все, что было в users + новый элемент user
        // setNotes([...notes, note]) лишний код

        let now = new Date()
        note.dateCreate = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1): now.getMonth() + 1}-${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`

        db.collection("notesData").doc(`${note.id}`).set({
            id: note.id,
            text: note.text,
            dateCreate: note.dateCreate,
            dateEnd: note.dateEnd
        })
    }

    // удаление пользователя
    // в очередной раз вызываем setUsers [1]
    // и передаем в setUsers массив без элемента, который нужно удалить

    const deleteNote = id => {
        setEditing(false)
        setNotes(notes.filter(note => note.id !== id))
        db.collection("notesData").doc(`${id}`).delete()
    }

    // обновление пользователя
    const updateNote = (id, updatedNote) => {
        // когда мы готовы обновить пользователя, ставим флажок editing в false
        setEditing(false)
        // и обновляем пользователя, если нашли его по id
        setNotes(notes.map(note => (note.id === id ? updatedNote : note)))
        db.collection("notesData").doc(`${id}`).update({
            id: updatedNote.id,
            text: updatedNote.text,
            dateCreate: updatedNote.dateCreate,
            dateEnd: updatedNote.dateEnd
        })
    }

    // редактирование пользователя
    const editRow = note => {
        // готовы редактировать - флажок в true
        setEditing(true)
        // устанавливаем значения полей для формы редактирования
        // на основании выбранного "юзера"
        setCurrentNote({ id: note.id, text: note.text, dateCreate: note.dateCreate, dateEnd: note.dateEnd })
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
                <NoteTable notes={notes} deleteNote={deleteNote} editRow={editRow} />}
            />
        </div>
    )
}

export { App }
