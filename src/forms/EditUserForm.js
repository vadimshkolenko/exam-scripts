import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import MaskedInput from 'react-text-mask'

const EditUserForm = props => {
    // в качестве начального аргумента передаем
    // пользователя, которого собираемся редактировать
    const [user, setUser] = useState(props.currentUser)
    const [emails, setEmails] = useState(props.currentUser.emails)

    //из-за этой части в форму после сохранения попадали старые данные
    // useEffect(
    //     () => {
    //         // вызывай данную функцию
    //         setUser(props.currentUser)
    //         setEmails(props.currentUser.emails)
    //     },
    //     [props] // всегда, если изменились props
    // )

    const handleInputChange = event => {
        const { name, value } = event.target

        setUser({ ...user, [name]: value })
    }

    const handleSubmit = event => {
        event.preventDefault()

        if (!user.name || !user.surname) return

        props.updateUser(user.id, user)

        ///фиксируем измененные значения в форме
        alert('Данные изменены')
    }

    //mail

    const emailInputChange = (event) => {
        let
            value = event.target.value,
            index = event.target.id,
            emailsArray = [...emails]

        emailsArray[index].email = value
        setEmails(emailsArray)
        setUser({ ...user, emails: emailsArray })
    }

    const addEmailField = (event) => {
        event.preventDefault()
        setEmails([...emails, { email: '' }])
    }

    const removeEmailField = (key) => {
        setEmails([...emails.filter((email, index) => index !== key)])
        // setUser({ ...user, emails: emails })
        setUser({ ...user, emails: [...emails.filter((email, index) => index !== key)] })
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Имя <sup>*</sup></label>
            <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
            />
            <label htmlFor="surname">Фамилия <sup>*</sup></label>
            <input
                type="text"
                name="surname"
                value={user.surname}
                onChange={handleInputChange}
            />
            <label htmlFor="phone">Телефон</label>
            <MaskedInput
                mask={['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                placeholder="Введите номер"
                guide={true}
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
            />
            <label>Почта</label>
            {
                !emails ? null :
                    emails.map((email, index) => {
                        return (
                            <div key={index} className="email-field">
                                <input
                                    id={index}
                                    type="text"
                                    name="email"
                                    value={emails[index].email}
                                    onChange={emailInputChange}
                                />
                                <button onClick={(event) => {
                                    event.preventDefault()
                                    removeEmailField(index)
                                }
                                }>-</button>
                            </div>
                        )
                    })
            }
            <button onClick={addEmailField}>Добавить почту</button>
            <label htmlFor="role">Должность</label>
            <select name='role' value={user.role} onChange={handleInputChange}>
                <option value='Сотрудник'>Сотрудник</option>
                <option value='Руководитель'>Руководитель</option>
            </select>
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

export { EditUserForm }