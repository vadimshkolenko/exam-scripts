import React, { useState, useEffect } from 'react'
import { AddUserForm } from './forms/AddUserForm'
import { UserTable } from './tables/UserTable'
import { EditUserForm } from './forms/EditUserForm'
import './App.css'
import { Route, NavLink } from 'react-router-dom';
import './firebaseConfig/firebaseConfig'
import * as firebase from 'firebase'

const App = () => {
    const db = firebase.firestore()

    const [users, setUsers] = useState([])

    useEffect(() => {
        db.collection("usersData").onSnapshot(snapshot => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setUsers(usersData)
        })
    }, [])

    // флаг editing - изначально false, функция установки флага
    const [editing, setEditing] = useState(false)

    // начальное значение для формы редактирования
    // так как мы не знаем, кто редактируется - пустые поля
    const initialFormState = { id: null, name: '', surname: '', phone: '', emails: '', role: '' }
    // значение "текущий пользователь на редактировании" + функция установки этого значения
    const [currentUser, setCurrentUser] = useState(initialFormState)

    const addUser = user => {

        if (users.length > 0) {
            user.id = users[users.length - 1].id + 1
        } else user.id = 1
        // вызываем setUsers определенную выше в хуке useState
        // передаем туда все, что было в users + новый элемент user
        setUsers([...users, user])
        // debugger
        db.collection("usersData").doc(`${user.id}`).set({
            id: user.id,
            name: user.name,
            surname: user.surname,
            phone: user.phone,
            role: user.role,
            emails: user.emails
        })
    }

    // удаление пользователя
    // в очередной раз вызываем setUsers [1]
    // и передаем в setUsers массив без элемента, который нужно удалить

    const deleteUser = id => {
        setEditing(false)
        setUsers(users.filter(user => user.id !== id))
        db.collection("usersData").doc(`${id}`).delete()
    }

    // обновление пользователя
    const updateUser = (id, updatedUser) => {
        // когда мы готовы обновить пользователя, ставим флажок editing в false
        setEditing(false)
        // и обновляем пользователя, если нашли его по id
        setUsers(users.map(user => (user.id === id ? updatedUser : user)))
        db.collection("usersData").doc(`${id}`).update({
            id: updatedUser.id,
            name: updatedUser.name,
            surname: updatedUser.surname,
            phone: updatedUser.phone,
            role: updatedUser.role,
            emails: updatedUser.emails
        })
    }

    // редактирование пользователя
    const editRow = user => {
        // готовы редактировать - флажок в true
        setEditing(true)
        // устанавливаем значения полей для формы редактирования
        // на основании выбранного "юзера"
        setCurrentUser({ id: user.id, name: user.name, surname: user.surname, phone: user.phone, role: user.role, emails: user.emails })
    }

    return (
        <div>
            <header>
                <NavLink exact to="/" activeClassName="activeLink">Персонал</NavLink>
                <NavLink to="/add-personal" activeClassName="activeLink">Добавить персонал</NavLink>
            </header>
            <Route path="/add-personal" render={() =>
                <AddUserForm addUser={addUser} />}
            />
            <Route exact path="/edit-personal" render={() =>
                <EditUserForm
                                editing={editing}
                                setEditing={setEditing}
                                currentUser={currentUser}
                                updateUser={updateUser}
                />}
            />
            <Route exact path="/" render={() =>
                <UserTable users={users} deleteUser={deleteUser} editRow={editRow} />}
            />

            {/* {editing ? (
                        <div>
                            <h2>Редактирование</h2>
                            <EditUserForm
                                editing={editing}
                                setEditing={setEditing}
                                currentUser={currentUser}
                                updateUser={updateUser}
                            />
                        </div>
                    ) : (
                            <div>
                                <h2>Добавление персонала</h2>
                                <AddUserForm addUser={addUser} />
                            </div>
                        )} */}
        </div>
    )
}

export { App }
