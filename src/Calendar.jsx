import { useState } from "react";
import "./Calendar.css";

export default function Calendar() {
    const today = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDaysNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const [date, setDate] = useState(new Date());
    const [clickDay, setClickDay] = useState(null);
    const [events, setEvents] = useState({});

    const month = date.getMonth();
    const year = date.getFullYear();

    const selectedDate = clickDay !== null ? new Date(year, month, clickDay) : null;
    const selectedDateKey = clickDay !== null ? `${year}-${month + 1}-${clickDay}` : null;

    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const getWeekDays = () => {
        if (!selectedDate) return [];
        const start = getWeekStart(selectedDate);
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push({
                day: d.getDate(),
                month: d.getMonth(),
                year: d.getFullYear(),
                key: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
            });
        }
        return days;
    };

    const generateCalendar = () => {
        let dayOne = new Date(year, month, 1).getDay();
        dayOne = dayOne === 0 ? 6 : dayOne - 1;
        const monthLastDate = new Date(year, month + 1, 0).getDate();
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        const days = [];

        for (let i = dayOne; i > 0; i--) {
            days.push(<li key={"prev" + i} className="inactive">{prevMonthLastDate - i + 1}</li>);
        }
        for (let i = 1; i <= monthLastDate; i++) {
            const isRealToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isClicked = clickDay === i;
            days.push(
                <li key={i} className={`${isRealToday ? "active" : ""} ${isClicked ? "highlight" : ""}`}
                    onClick={() => setClickDay(clickDay === i ? null : i)}>
                    {i}
                </li>
            );
        }
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push(<li key={"next" + i} className="inactive">{i}</li>);
        }
        return days;
    };

    const addEvent = () => {
        if (!clickDay) return;
        const eventName = prompt("Event name:");
        if (!eventName) return;
        setEvents(prev => ({
            ...prev,
            [selectedDateKey]: prev[selectedDateKey] ? [...prev[selectedDateKey], eventName] : [eventName]
        }));
    };

    const deleteEvent = (dateKey, index) => {
        setEvents(prev => ({
            ...prev,
            [dateKey]: prev[dateKey].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="calendar-outer-container">
            <div className="calendar-wrapper">
                {/* NAVIGATION LINKS */}
                <div className="Calendar-Container">
                    <h1>Calendar</h1>
                    <div className="calendar-header">
                        <button onClick={() => { setDate(new Date(year, month - 1, 1)); setClickDay(null); }}>Prev</button>
                        <h2>{months[month]} {year}</h2>
                        <button onClick={() => { setDate(new Date(year, month + 1, 1)); setClickDay(null); }}>Next</button>
                    </div>
                    <div className="calendar-body">
                        <ul className="calendar-weekdays">
                            {weekDaysNames.map(day => <li key={day}>{day}</li>)}
                        </ul>
                        <ul className="calendar-dates">{generateCalendar()}</ul>
                    </div>
                </div>

                {/* HAUPTBEREICH RECHTS */}
                <div className="event-panel">
                    <div className="panel-header-row">
                        <h2 className="overview-title">Week Overview</h2>
                        <button className="add-event-btn" onClick={addEvent}>+ Add Event</button>
                    </div>

                    <div className="week-view">
                        {clickDay ? getWeekDays().map((d, i) => {
                            const isToday = d.day === today.getDate() && d.month === today.getMonth() && d.year === today.getFullYear();
                            return (
                                <div key={i} className={`week-day-card 
                                    ${d.day === clickDay && d.month === month ? "selected" : ""} 
                                    ${isToday ? "today-card" : ""}`}>
                                    <div className="card-header">
                                        <strong>{weekDaysNames[i]}</strong>
                                        <span>{d.day}. {months[d.month].substring(0, 3)}</span>
                                    </div>
                                    <div className="card-events">
                                        {events[d.key]?.map((ev, idx) => (
                                            <div key={idx} className="mini-event">
                                                <span className="event-text">{ev}</span>
                                                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteEvent(d.key, idx); }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }) : <div className="no-selection-msg">Select a day to view the week</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}