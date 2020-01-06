import React, { useState } from 'react'

const AddNoteForm = props => {
    const initialFormState = { id: null, text: '', dateCreate: '', dateEnd: '' }
    // используем useState и передаем в качестве начального значения объект - initialFormState
    const [note, setNote] = useState(initialFormState)

    const handleInputChange = event => {
        const
            name = event.currentTarget.name,
            value = event.currentTarget.value

        setNote({ ...note, [name]: value })
    }

    const handleSubmit = event => {
        event.preventDefault()
        if (!note.text || !note.dateEnd) return

        // вызываем addUser из хука из App
        props.addNote(note)
        // обнуляем форму, с помощью setUser функции
        // которая у нас взята из хука в данном компоненте
        setNote(initialFormState)
        alert('Заметка добавлена')
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
                onChange={handleInputChange}/>
            <button>Добавить</button>
        </form>
    )
}

export { AddNoteForm }