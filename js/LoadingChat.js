import React, {useState, useEffect} from "react";

const usersUrl = 'https://jsonsscorpionikr.herokuapp.com/users';

const LoadingChat = (props) =>  {
    const {loaded} = props;
    const [Newwidth, setNewwidth] = useState(0);

     const fetchUsers = () => {
        fetch(usersUrl)
            .then(response => response.json())
            .then(response => console.log("ladowanie bazy..."))
    };

    const handleLoad = () => {
        if (typeof loaded === 'function') {
            loaded()
        }
    }

    useEffect(() => {
        const timerId = setInterval(() => {
            if (Newwidth <100) {
                setNewwidth(prevstate => prevstate + 1);
                fetchUsers();
            }
        }, 50)

        return() => {  clearInterval(timerId); }
    }, []);

    if (Newwidth == 100) {
        handleLoad();
    }

     return (
         <>
         <div className="loginPage container pr-30 pl-30">
             <div className="loginForm">
                 <h1>CHAT</h1>
                 <h2>Trwa ładowanie...</h2>
                 <div className="progress">
                     <div className="progress-bar" style={{width: Newwidth +"%"}}></div>
                 </div>
             </div>
         </div>
         <footer>
                 <p className="copyright">Copyright: <a href="https://www.solskar.pl" target="_blank">SolSkar</a></p>
         </footer>
         </>
     )
}

export default LoadingChat;