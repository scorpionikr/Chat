import React, { useState, useEffect } from 'react';
import Clock from './Clock'

const Chat = () => {
    const chatUrl = 'http://localhost:3000/chat';
    const usersUrl = 'http://localhost:3000/users';
    const logsUrl = 'http://localhost:3000/logs';
    const admin = "SCORPIONIKR ";
    const tableofcolors = ["black", "darkblue", "green", "blue", "orange", "violet"];
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    const [eventMessage, setEventMessage] = useState([]);
    const [login, setLogin] = useState("");
    const [logged, setLogged] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [date, setdate] = useState(new Date())

    //Do uzycia przy kodzie MOBILE=================================================
    // const hamburger = () => {
        // menu.classList.toggle('visible');
        // menu.classList.toggle('unvisible');
    // }

    // const menu_list = () => {
    // forEach(function(element) {
    //         element.addEventListener('click', function(){
    //             menu.classList.toggle('visible');
    //             menu.classList.toggle('unvisible');
    //         });
    //     });
    // }

    // const mobile = window.matchMedia("screen and (max-width: 767px)");
    // mobile.addListener(function(){
    //     if (mobile.matches) {
    //         menu.classList.remove('visible');
    //     }
    // });

    //chat logika ===================================================================

    useEffect(() => {
        const timerId = setInterval(() => {
            fetchUsers();
            fetchMessages()
            fetchEvents()
        }, 1000)
        return() => {  clearInterval(timerId);    }

    }, []);

    const fetchUsers = () => {
        fetch(usersUrl)
            .then(response => response.json())
            .then(response => setUsers(response))
    };

    const fetchMessages = () => {
        fetch(chatUrl)
            .then(response => response.json())
            .then(response => setMessages(response))
    };

    const fetchEvents = () => {
        fetch(logsUrl)
            .then(response => response.json())
            .then(response => setEventMessage(response))
    };

    const changeMessage = e => {
        setNewMessage(e.target.value);
    }

    const currentTime = () => {
        setdate(new Date())
    }

    const scrollToBottom = () => {
        // let firstTime = true;
        // if (firstTime) {
            messages.scrollTop = messages.scrollHeight;
        //     firstTime = false;
        // } else if (messages.scrollTop + messages.clientHeight === messages.scrollHeight) {
        //     messages.scrollTop = messages.scrollHeight;
        // }
    }

    const addMessage = () => {
        const url = chatUrl;
        currentTime()
        const dataNew = {
            name: login.toUpperCase(),
            message: newMessage,
            color: getUserColor(login.toUpperCase()),
            time: date.toLocaleTimeString()
        }
        fetch(url,{
            method: "POST",
            body: JSON.stringify(dataNew),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status == 201) {
                return response.json()
            }
        }).then(dataNew => {
            console.log(dataNew);
            setMessages(prevtable => [...prevtable, dataNew]);
        })
            .catch(error => {
                console.log(error);
            });
    }

    const handleSubmit = (e) => {
        console.log(messages)
        e.preventDefault();
        if (newMessage.length >0) {
            addMessage();
            setNewMessage("")
        }
    }

    //================================================================================
    //logowanie do chata

    const handleLoginChange = e => {
        setLogin(e.target.value);
    }

    const colorrandom = (array) =>{
        return array[Math.floor(Math.random()*array.length)];
    }

    const getUserColor = (username) =>{
        let userColor = null;
        users.forEach(user => {
            if (user.name == username) {
                userColor = user.color;
            };
        })
        return userColor;
    }

    const handleLogin = e => {
        e.preventDefault();
        const validationErrors = validate();
        if (validationErrors.length !== 0) {
            setErrors(validationErrors);
        } else {
            setLogged(true)
            addUser();
            addLogs(login.toUpperCase() + ' zalogował się!')
        }
    }

    const validate = () => {
        const validationErrors = [];
        if (!login || login.length <= 2) {
            validationErrors.push('Login powinien zawierać więcej niż 2 znaki!')
        }
        users.forEach(user => {
            if (user.name == login.toLocaleUpperCase()) {
                validationErrors.push('Uzytkownik '+login+' jest już zalogowany!')
            }
        })
        return validationErrors;
    }

    const addUser = () => {
        const url = usersUrl;
        let logincolor = ""
        if (login.toLocaleUpperCase()== admin) {
            logincolor = "red"
        } else {
            logincolor = colorrandom(tableofcolors)
        }
            const dataNew = {
            name: login.toLocaleUpperCase(),
            color: logincolor
        }
        fetch(url,{
            method: "POST",
            body: JSON.stringify(dataNew),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status == 201) {
                return response.json()
            }
        }).then(dataNew => {
            console.log(dataNew);
            setUsers(prevtable => [...prevtable, dataNew]);
        })
            .catch(error => {
                console.log(error);
            });
    }

    const addLogs = (newMessage) => {
        const url = logsUrl;
        const dataNew = {
            message: newMessage,
        }
        fetch(url,{
            method: "POST",
            body: JSON.stringify(dataNew),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.status == 201) {
                return response.json()
            }
        }).then(dataNew => {
            console.log(dataNew);
            setEventMessage(prevtable => [...prevtable, dataNew]);
        })
            .catch(error => {
                console.log(error);
            });
    }

    //================================================================================
    //wylogowanie z chata

    const userDel = userId => {
        const url = usersUrl + "/" + userId;
        fetch(url, {
            method: "DELETE"
        }).then(response => {
            if(response.status === 200) {
                setUsers(prevTable => {
                    return prevTable.filter(user => {
                        return user.id !== userId;
                    })
                })
            }
        })
    }

    const logOut = (username) => {
        let userId = null;
        users.forEach(user => {
                if (user.name == username) {
                    userId = user.id;
                };
            })
        userDel(userId);
        setLogged(false)
        addLogs(username+ ' wylogował się!')
    }

    //Funkcje administracyjne ======================================================

    const AdminUsunUser = (userId, username) => {
        userDel(userId);
        addLogs(username+ ' Wylogowany przez Admin!')
    }

    const AdminClearChat = () => {
        let url = ""
        messages.forEach(message => {
            url = chatUrl + "/" + message.id;
            fetch(url, {
                method: "DELETE"
            }).then(response => {

            })
        })
                setMessages([])
                addLogs('Admin wyczyścił chat!')
    }

    const AdminUsunMessage = messageId => {
        const url = chatUrl + "/" + messageId;
        fetch(url, {
            method: "DELETE"
        }).then(response => {
            if(response.status === 200) {
                setMessages(prevTable => {
                    return prevTable.filter(message => {
                        return message.id !== messageId;
                    })
                })
                addLogs('Admin usunął tą wiadomość!')
            }
        })
    }

    //Renderowanie ====================================================

    if (logged === false) {
        return (
            <div className="loginPage container pr-30 pl-30">
                <form className="loginForm" onSubmit={handleLogin}>
                    <label>Podaj swoje imię:</label>
                    <input type="text" name="login" value={login} onChange={handleLoginChange} />
                    <button type="submit">Zaloguj!</button>
                    <ul className="alert">
                        {errors.map((error, index) => {
                            return <li key={index}>{error}</li>
                        })}
                    </ul>
                </form>
            </div>
        )
    } else {
        return (
            <>
            <header className="header">
                <div className="header-content container pr-30 pl-30">
                    <div className="logo">Chat <Clock/></div>
                    {login.toUpperCase() == admin ? <span className="Admin center">Witaj Admin!</span> : ""}
                    <nav>
                        <div className="hamburger pr-30">
                            <button>
                                <i className="fas fa-bars"></i>
                            </button>
                        </div>
                        <ul className="list__navigation unvisible">
                            <li onClick={() => logOut(login.toLocaleUpperCase())}>
                                Wyloguj: {login.toLocaleUpperCase()}
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
                <main className="container pr-30 pl-30 ">
                    <div className="section1 pt-20">
                            <div className="messages">
                                <span>Wiadomości:</span>
                                <ul >
                                    {messages.map((message) => {
                                        return (
                                            <li key={message.id} style={{color: message.color}}>{message.name.toLocaleUpperCase()} [{message.time}]: {message.message} {login.toUpperCase() == admin ? <button className="AdminButton" onClick={() => AdminUsunMessage(message.id)}>Usuń</button> : ""}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="users center">
                                Użytkownicy:
                                <ul>
                                    {users.map((user) => {
                                        return (
                                            <li key={user.id} style={{color: user.color}}> {user.name} {login.toUpperCase() == admin && user.name != admin ? <button className="AdminButton" onClick={() => AdminUsunUser(user.id, user.name)}>Usuń</button> : ""}</li>

                                        )
                                    })}
                                </ul>
                            </div>
                    </div>
                    <div className="section2 pr-30 pl-30 pt-10 pb-10">
                          <form className="sendForm" onSubmit={handleSubmit}>
                                    <p>Twoja wiadomość:</p>
                                    <input type="text" name="message" value={newMessage} onChange={changeMessage}/>
                                    <button type="submit" className="btn-send">Wyślij</button>
                                    {login.toUpperCase() == admin ? <button className="AdminButton" onClick={AdminClearChat}>Wyczyść</button> : ""}
                          </form>
                        {eventMessage.length >0 ? <div className="EventM center">{eventMessage[eventMessage.length-1].message}</div> : ""}
                    </div>
                </main>

                <footer>
                    <div className="footer container pr-30 pl-30 pt-10">
                        <span> Chat ver. 1.0</span>
                        <span>Copyright: ScorpionikR</span>
                    </div>
                </footer>
            </>
        );
    }

};

export default Chat;