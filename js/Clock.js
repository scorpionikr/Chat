import React, {useState, useEffect} from 'react';

import ClockTime from './ClockTime';
import ClockDate from './ClockDate';

const Clock = () => {
    const [date, setdate] = useState(new Date())

    useEffect(() => {
            const timerId = setInterval(() => {
                setdate(new Date())

    }, 1000)
        return() => {  clearInterval(timerId);    }

}, [])

    return (
        <>
            <ClockTime date={date}/>
            {/*<ClockDate date={date}/>*/}
        </>
    )
}


export default Clock