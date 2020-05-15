import React, {Component} from "react";
import ReactDOM from "react-dom";
import "../scss/main.scss";
import Chat from './Chat'

const App = () => {
    return <Chat/>
}

ReactDOM.render(<App/>, document.getElementById("app"));