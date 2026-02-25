import { useState } from "react";
import "./Calendar.css";


export default function Calendar() {
    const today = new Date();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [date, setDate] = useState(new Date());
    const [clickDay, setClickDay] = useState(null);
    const [events, setEvents] = useState({})

    const month = date.getMonth();
    const year = date.getFullYear();

    const selectedDateKey = clickDay ? `${year}-${month+1}-${clickDay}` : null;

    const generateCalendar = () => {
        const dayOne = new Date(year, month, 1).getDay();
        const monthLastDate = new Date(year, month + 1, 0).getDate();
        const dayEnd = new Date(year, month, monthLastDate).getDay();

        const days = [];

        const prevMonthLastDate = new Date(year, month, 0).getDate();

        for (let i = dayOne; i > 0; i--) {
            days.push(
                <li key={"prev" + i} className="inactive">
                    {prevMonthLastDate - i + 1}
                </li>
            );
        }

        for (let i = 1; i <= monthLastDate; i++) {
            const isToday =
                i === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            const isClicked = clickDay === i;

            days.push(
                <li
                    key={i}
                    className={`${isToday ? "active" : ""} ${isClicked ? "highlight" : ""}`}
                    onClick={() => setClickDay(clickDay === i ? null : i)}

                >
                    {i}
                </li>
            );
        }

        for (let i = dayEnd; i < 6; i++) {
            days.push(
                <li key={"next" + i} className="inactive">
                    {i - dayEnd + 1}
                </li>
            );
        }



        return days;
    };

    const prevMonth = () => {
        setDate(new Date(year, month - 1, 1));
        setClickDay(null);
    };

    const nextMonth = () => {
        setDate(new Date(year, month + 1, 1));
        setClickDay(null);
    };

    const addEvent = () =>{
        if(!clickDay) return;
        const eventName = prompt("Gib den namen ein:");
        if(!eventName) return;

        setEvents(prev => ({
            ...prev,
            [selectedDateKey]: prev[selectedDateKey] ? [...prev[selectedDateKey], eventName] : [eventName]
        }));
    };

    return (
        <>
            <div className="Calendar-Container">
                <h1>Calendar</h1>
                <div className="calendar-header">
                    <button onClick={prevMonth}>Prev</button>
                    <h2>{months[month]} {year}</h2>
                    <button onClick={nextMonth}>Next</button>
                </div>
                <div className="calendar-body">
                    <ul className="calendar-weekdays">
                        <li>Sun</li>
                        <li>Mon</li>
                        <li>Tue</li>
                        <li>Wed</li>
                        <li>Thu</li>
                        <li>Fri</li>
                        <li>Sat</li>
                    </ul>
                    <ul className="calendar-dates">{generateCalendar()}</ul>
                </div>
                <div className="clickDay">
                    <h2>{clickDay ? `${clickDay} ${months[month]} ${year}` : "Kein Tag ausgewählt"}</h2>
                </div>
            </div>
            <div className="eventAdd">
                {clickDay && (
                    <>
                        <button onClick={addEvent}>Event hinzufügen</button>
                        <div className="events">
                            {events[selectedDateKey]?.map((ev, i) => <p key={i}>{ev}</p>)}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
