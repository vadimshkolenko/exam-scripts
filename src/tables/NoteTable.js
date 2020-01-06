import React from 'react'
import { NavLink } from 'react-router-dom';

const NoteTable = props => {

    const handleDeleteNote = id => {
        props.deleteNote(id)
    }

    const finishedNote = (dateEnd) => {
        const now = new Date()
        const dateNow = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1}-${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`
        const dateNowArray = dateNow.split('-')
        const dateEndArray = dateEnd.split('-')
        for (let i = 0; i < dateEndArray.length; i++) {
            if (Number(dateNowArray[i]) === Number(dateEndArray[i])) continue
            if (Number(dateNowArray[i]) > Number(dateEndArray[i]))
                return { backgroundColor: '#ff8f8f' }
            else
                return { backgroundColor: 'white' };
        }
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Текст</th>
                    <th>Дата создания</th>
                    <th>Дата завершения</th>
                    <th colSpan={1}></th>
                </tr>
            </thead>
            <tbody>
                {props.notes.length > 0 ? (
                    props.notes.map(note => (
                        <tr key={note.id} style={finishedNote(note.dateEnd)}>
                            <td>{note.text}</td>
                            <td>{note.dateCreate}</td>
                            <td>{note.dateEnd}</td>
                            <td>
                                <NavLink to="/edit-note">
                                    <button
                                        className="button muted-button"
                                        onClick={() => props.editRow(note)}
                                    >&#9998;</button>
                                </NavLink>
                                <button
                                    className="button muted-button"
                                    onClick={() => handleDeleteNote(note.id)}
                                >&#10005;</button>
                            </td>
                        </tr>
                    ))
                ) : (
                        <tr>
                            <td colSpan={4}>No notes</td>
                        </tr>
                    )}
            </tbody>
        </table>
    )

}

export { NoteTable }