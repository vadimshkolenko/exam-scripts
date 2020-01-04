import React, { useState } from 'react'
import MaskedInput from 'react-text-mask'

const AddUserForm = props => {
    const initialFormState = { id: null, name: '', surname: '', phone: '', emails: [], role: 'Сотрудник' }
    // используем useState и передаем в качестве начального значения объект - initialFormState
    const [user, setUser] = useState(initialFormState)
    const [emails, setEmails] = useState([{ email: '' }])

    const handleInputChange = event => {
        const
            name = event.currentTarget.name,
            value = event.currentTarget.value

        setUser({ ...user, [name]: value })
    }

    const handleSubmit = event => {
        event.preventDefault()
        if (!user.name || !user.surname || !user.role) return

        // вызываем addUser из хука из App
        props.addUser(user)
        // обнуляем форму, с помощью setUser функции
        // которая у нас взята из хука в данном компоненте
        setUser(initialFormState)
        setEmails([{ email: '' }])
        alert('Персонал добавлен')
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
        setUser({ ...user, emails: [...emails.filter((email, index) => index !== key)] })
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Имя <sup>*</sup></label>
            <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
            />
            <label>Фамилия <sup>*</sup></label>
            <input
                type="text"
                name="surname"
                value={user.surname}
                onChange={handleInputChange}
            />
            <label>Телефон</label>
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
            <label>Должность</label>
            <select name='role' value={user.role} onChange={handleInputChange}>
                <option value='Сотрудник'>Сотрудник</option>
                <option value='Руководитель'>Руководитель</option>
            </select>
            <button>Добавить</button>
        </form>
    )
}

export { AddUserForm }