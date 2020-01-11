import React, {useState, useEffect} from 'react'
import { NavLink } from 'react-router-dom';
import Fuse from 'fuse.js'

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

    // Поиск

    const [searchString, setSearchString] = useState('')
    const [filteredTable, setFilteredTable] = useState(props.notes)

    const onChangeSearch = e => {
        const {value} = e.target
        setSearchString(value)
    }

    const filterTable = (table, filter) => {
        if (!filter) return table
    
        const searchOptions = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 0,
            minMatchCharLength: 1,
            keys: ['text']
        }
    
        const fuse = new Fuse(table, searchOptions)
        const result = fuse.search(filter)
    
        return result
    }

    useEffect(() => {
        setFilteredTable(filterTable(props.notes, searchString))
    }, [searchString, props.notes])

    return (
        <div>
            <input type="text" value={searchString} onChange={onChangeSearch} id="search" placeholder="Поиск..."/>
            <table>
                <thead>
                    <tr>
                        <th>Текст</th>
                        <th onClick={() => props.onSort('dateCreate')}>
                            Дата создания {props.sortField === 'dateCreate' ? (props.sort === 'asc' ? <small>&uarr;</small> : <small>&darr;</small>) : null}
                        </th>
                        <th onClick={() => props.onSort('dateEnd')}>
                            Дата завершения {props.sortField === 'dateEnd' ? (props.sort === 'asc' ? <small>&uarr;</small> : <small>&darr;</small>) : null}
                        </th>
                        <th colSpan={1}></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTable.length > 0 ? (
                        filteredTable.map(note => ( //???
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
                                <td colSpan={4}>Нет записей</td>
                            </tr>
                        )}
                </tbody>
            </table>
        </div>
    )

}

export { NoteTable }