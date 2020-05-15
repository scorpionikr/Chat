import React from "react";


const ClockDate = (props) => {
    return (
        <span>{props.date.toLocaleDateString()}</span>
    )
}

export default ClockDate