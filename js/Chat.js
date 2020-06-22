import React, { useRef, useState, useEffect } from 'react';
import {useMediaQuery, useMediaQueries} from '@react-hook/media-query'
import Clock from './Clock'
import LoadingChat from './LoadingChat'

const Chat = () => {
    const chatUrl = 'https://jsonsscorpionikr.herokuapp.com/chat';
    const usersUrl = 'https://jsonsscorpionikr.herokuapp.com/users';
    const logsUrl = 'https://jsonsscorpionikr.herokuapp.com/logs';
    const admin = "SCORPIONIKR";
    const adminPassword = "Skarbus";
    const tableofcolors = ["black", "darkblue", "green", "blue", "darkgreen", "violet"];
    const [messages, setMessages] = useState([]);
    const [isnewmessages, setIsNew] = useState(false);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    const [eventMessage, setEventMessage] = useState(["Logs"]);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [logged, setLogged] = useState(false);
    const [loaded, setloaded] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [date, setdate] = useState(new Date())
    const [isMobile, setisMobile] = useState(false);
    const [Issmessages, setIssmessages] = useState(true);
    const [IsUsers, setIsUsers] = useState(false);
    const loggedOutMessage = login.toUpperCase()+ ' Wylogowany przez Admin!'
    const liRref = useRef();
    const {matches, matchesAny, matchesAll} = useMediaQueries({
        screen: 'screen',
        width: '(min-width: 768px)'
    })

    //Czy strona zaladowana=======================================================

    const siteLoaded = () => {
        setloaded(true)
    }

    // Do uzycia przy kodzie MOBILE=================================================

    const ViewMessage = () => {
        setIssmessages(true)
        setIsUsers(false)
        setisMobile(false)
    }
    const ViewUsers = () => {
        // setIssmessages(false)
        // setIsUsers(true)
        // setisMobile(false) narazie to nie dziala
    }
    const LogUOut = () => {
        logOut(login.toLocaleUpperCase())
        setisMobile(false)
    }

    //chat logika ===================================================================

    useEffect(() => {
        const timerId = setInterval(() => {
            fetchUsers();
            fetchMessages()
            fetchEvents()
            scrollToBottom()
        }, 1000)

        return() => {  clearInterval(timerId);    }
    }, [logged]);

    const scrollToBottom = () => {
        if (logged == true) {
            liRref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

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
            setMessages(prevtable => [...prevtable, dataNew]);
            liRref.current.scrollIntoView({ behavior: 'smooth' });
        })
            .catch(error => {
                console.log(error);
            });
    }

    const handleSubmit = (e) => {
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

    const handlePasswordChange = e => {
        setPassword(e.target.value);
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
            setErrors([])
        }
    }

    const validate = () => {
        const validationErrors = [];
        if (!login || login.length <= 2) {
            validationErrors.push('Login powinien zawierać więcej niż 2 znaki!')
        }
        if (login.toUpperCase() ==admin) {
            if (!password || password.length <= 2 || password != adminPassword) {
                validationErrors.push('hasło niepoprawne!')
            }
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
            setPassword("")
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
        // setErrors(["Zostałeś wyrzucony z chat!"])
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
                addLogs('Admin usunął wiadomość!')
            }
        })
    }

    //Renderowanie ====================================================

    if (loaded === false) {
        return (
            <LoadingChat loaded={siteLoaded}/>
        )
    } else  if (logged === false)  {
        return (
            <>
            <div className="loginPage container pr-30 pl-30">
                <form className="loginForm" onSubmit={handleLogin}>
                    <h1>CHAT</h1>
                    <label>Podaj swoje imię:</label>
                    <input type="text" name="login" value={login} onChange={handleLoginChange} />
                    {login.toUpperCase() == admin ? <input type="password" name="password" value={password} onChange={handlePasswordChange} />: ""}
                    <button type="submit">Zaloguj!</button>
                    <ul className="alert">
                        {errors.map((error, index) => {
                            return <li key={index}>{error}</li>
                        })}
                    </ul>
                    {users.length == 0 ? <h3>Brak zalogowanych użytkowników!</h3> : <h3>Zalogowanych {users.length} użytkowników!</h3>}
                </form>
            </div>
            <footer>
                <p className="copyright">Copyright: <a href="https://www.solskar.pl" target="_blank">SolSkar</a></p>
            </footer>
            </>
        )
    } else {
        return (
            <>
            <header className="header">
                <div className="header-content container pr-30 pl-30">
                    <div className="logo">Chat <Clock/></div>
                    {login.toUpperCase() == admin ? <span className="Admin center">Witaj Admin!</span> : ""}
                    <nav>
                        <div className="hamburger" >
                            <button >
                                <i className="fas fa-bars" onClick={() => setisMobile(!isMobile)}></i>
                            </button>
                        </div>
                        <ul className="list__navigation unvisible">
                            <li onClick={() => logOut(login.toLocaleUpperCase())}>
                                Wyloguj: {login.toLocaleUpperCase()}
                            </li>
                        </ul>
                        <ul className={isMobile ? 'list__navigation navigation_mobile' : ' unvisible'}>
                            <li onClick={ViewMessage}>
                                WIADOMOŚCI
                            </li>
                            <li onClick={ViewUsers}>
                                UŻYTKOWNICY
                            </li>
                            <li onClick={LogUOut}>
                                WYLOGUJ: {login.toLocaleUpperCase()}
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
                <main className="container pr-30 pl-30 ">
                    <div className="section1 pt-20">
                            <div className={Issmessages ? ' messages ' : 'unvisible'}>
                                <span>Wiadomości:</span>
                                <ul >
                                    {messages.map((message) => {
                                        return (
                                            <li ref={liRref} key={message.id} style={{color: message.color}}>{message.name.toLocaleUpperCase()} [{message.time}]: {message.message} {login.toUpperCase() == admin ? <button className="AdminButton" onClick={() => AdminUsunMessage(message.id)}>Usuń</button> : ""}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className={ matches.screen ? 'users center' : ' unvisible'}>
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
                                    <p className="unvisible">Twoja wiadomość:</p>
                                    <input type="text" name="message" value={newMessage} onChange={changeMessage}/>
                                    <button type="submit" className="btn-send">Wyślij</button>
                                    {login.toUpperCase() == admin ? <button className="AdminButton" onClick={AdminClearChat}>Wyczyść</button> : ""}
                          </form>
                        {eventMessage[eventMessage.length-1].message == loggedOutMessage ? setLogged(false) :<div className="EventM center">{eventMessage[eventMessage.length-1].message}</div>}
                    </div>
                </main>

                <footer>
                    <div className="footer container pr-30 pl-30 pt-10">
                        <span>Chat ver. 4.1</span>
                        <span>Copyright: <a href="https://www.solskar.pl" target="_blank">SolSkar</a></span>
                    </div>
                </footer>
            </>
        );
    }
};

export default Chat;