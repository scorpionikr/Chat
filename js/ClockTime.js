import React from "react";


const ClockTime = (props) => {
    return (
        <span>{props.date.toLocaleTimeString()}</span>
    )
}

export default ClockTime