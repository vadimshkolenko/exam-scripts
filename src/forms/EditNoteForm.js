import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';

const EditNoteForm = props => {
    // в качестве начального аргумента передаем
    // пользователя, которого собираемся редактировать
    const [note, setNote] = useState(props.currentNote)
    

    const handleInputChange = event => {
        const { name, value } = event.target

        setNote({ ...note, [name]: value })
    }

    const handleSubmit = event => {
        event.preventDefault()

        if (!note.text || !note.dateEnd) return

        props.updateNote(note.id, note)
        alert('Изменения внесены')
    }


    return (
        <form onSubmit={handleSubmit}>
            <textarea type="text"
                name="text"
                value={note.text}
                onChange={handleInputChange}
                cols="30"
                rows="10">
            </textarea>
            <label>Дата завершения:</label>
            <input
                type="date"
                name="dateEnd"
                value={note.dateEnd}
                onChange={handleInputChange} />
            <button>Сохранить</button>
            <NavLink to="/">
                <button
                    /* обновляем флаг editing */
                    onClick={() => props.setEditing(false)}
                    className="button muted-button"
                >Назад
                </button>
            </NavLink>
        </form>
    )
}

export { EditNoteForm }