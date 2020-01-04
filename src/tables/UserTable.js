import React from 'react'
import { NavLink } from 'react-router-dom';

const UserTable = props => {

    const handleDeleteUser = id => {
        props.deleteUser(id)
    }

    const colorRole = (role) => {
        if (role == 'Руководитель') {
            return { backgroundColor: '#e2eeff' };
        } else return { backgroundColor: 'white' };
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Должность</th>
                    <th>Телефон</th>
                    <th>E-mail</th>
                    <th colSpan={1}></th>
                </tr>
            </thead>
            <tbody>
                {props.users.length > 0 ? (
                    props.users.map(user => (
                        <tr key={user.id} style={colorRole(user.role)}>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.role}</td>
                            <td>{user.phone}</td>
                            <td>
                                {
                                    !user.emails ? null :
                                        user.emails.map((email, index) => {
                                            return (
                                                <div key={index}>
                                                    {email.email}
                                                </div>
                                            )
                                        })
                                }
                            </td>
                            <td>
                                <NavLink to="/edit-personal">
                                    <button
                                        className="button muted-button"
                                        onClick={() => props.editRow(user)}
                                    >&#9998;</button>
                                </NavLink>
                                <button
                                    className="button muted-button"
                                    onClick={() => handleDeleteUser(user.id)}
                                >&#10005;</button>
                            </td>
                        </tr>
                    ))
                ) : (
                        <tr>
                            <td colSpan={6}>No users</td>
                        </tr>
                    )}
            </tbody>
        </table>
    )

}

export { UserTable }