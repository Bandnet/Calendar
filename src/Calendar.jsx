import { useState, useEffect } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./Calendar.css";
import Events from "./Events";

export default function Calendar() {
    // --- KONSTANTEN ---
    const today = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDaysNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // --- STATES ---
    const [date, setDate] = useState(new Date());
    const [clickDay, setClickDay] = useState(null);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    // Modal-States
    const [isModalOpen, setIsModalOpen] = useState(false); // Add Event Modal
    const [viewEvent, setViewEvent] = useState(null);      // Detail View Modal
    const [formData, setFormData] = useState({ title: "", description: "", time: "" });

    // Events State mit LocalStorage
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('calendarEvents');
        return saved ? JSON.parse(saved) : {};
    });

    // --- EFFEKTE ---
    useEffect(() => {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }, [events]);

    // --- VARIABLEN ---
    const month = date.getMonth();
    const year = date.getFullYear();
    const selectedDateKey = clickDay !== null ? `${year}-${month + 1}-${clickDay}` : null;

    // --- LOGIK FUNKTIONEN ---
    const handleSaveEvent = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        const newEventObj = {
            id: Date.now(),
            title: formData.title,
            description: formData.description,
            time: formData.time
        };

        setEvents(prev => ({
            ...prev,
            [selectedDateKey]: prev[selectedDateKey] ? [...prev[selectedDateKey], newEventObj] : [newEventObj]
        }));

        setFormData({ title: "", description: "", time: "" });
        setIsModalOpen(false);
    };

    const deleteEvent = (dateKey, id) => {
        setEvents(prev => ({
            ...prev,
            [dateKey]: prev[dateKey].filter((ev) => ev.id !== id)
        }));
    };

    const openViewModal = (eventObj, dateKey) => {
        setViewEvent({ ...eventObj, dateKey });
    };

    const openAddEventModal = () => {
        if (!clickDay) {
            alert("Please select a day first!");
            return;
        }
        setIsModalOpen(true);
    };

    // --- KALENDER GENERIERUNG ---
    const getWeekStart = (d) => {
        const dateCopy = new Date(d);
        const day = dateCopy.getDay();
        const diff = dateCopy.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(dateCopy.setDate(diff));
    };

    const getWeekDays = () => {
        if (clickDay === null) return [];
        const selectedDate = new Date(year, month, clickDay);
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
                    onClick={() => {
                        setClickDay(clickDay === i ? null : i);
                        if (window.innerWidth <= 1100) setIsCalendarVisible(false);
                    }}>
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

    return (
        <div className="calendar-outer-container">
            <div className="calendar-wrapper">
                {/* KALENDER BOX */}
                <div className="Calendar-Container">
                    <h1>Calendar</h1>
                    <div className="calendar-header">
                        <button onClick={() => setDate(new Date(year, month - 1, 1))}>Prev</button>
                        <h2 className="mobile-toggle-btn" onClick={() => setIsCalendarVisible(!isCalendarVisible)}>
                            {months[month]} {year}
                            <i className={`bi bi-chevron-${isCalendarVisible ? 'up' : 'down'} mobile-only-icon`}></i>
                        </h2>
                        <button onClick={() => setDate(new Date(year, month + 1, 1))}>Next</button>
                    </div>

                    <div className={`calendar-body ${isCalendarVisible ? "mobile-visible" : "mobile-hidden"}`}>
                        <ul className="calendar-weekdays">
                            {weekDaysNames.map(day => <li key={day}>{day}</li>)}
                        </ul>
                        <ul className="calendar-dates">{generateCalendar()}</ul>
                    </div>
                </div>

                {/* EVENTS BOX (Wochenübersicht) */}
                <Events
                    clickDay={clickDay}
                    getWeekDays={getWeekDays}
                    today={today}
                    month={month}
                    months={months}
                    weekDaysNames={weekDaysNames}
                    events={events}
                    addEvent={openAddEventModal}
                    openViewModal={openViewModal}
                />
            </div>

            {/* MODAL: EVENT HINZUFÜGEN */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Add Event for {selectedDateKey}</h3>
                        <form onSubmit={handleSaveEvent}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                            <div className="modal-buttons">
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="save-btn">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: EVENT DETAILS ANSEHEN */}
            {viewEvent && (
                <div className="modal-overlay" onClick={() => setViewEvent(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ color: "#59e24a" }}>Event Details</h3>

                        <div className="detail-item">
                            <label>Titel:</label>
                            <p><strong>{viewEvent.title}</strong></p>
                        </div>

                        {viewEvent.time && (
                            <div className="detail-item">
                                <label>Zeit:</label>
                                <p>{viewEvent.time}</p>
                            </div>
                        )}

                        {viewEvent.description && (
                            <div className="detail-item">
                                <label>Beschreibung:</label>
                                <p>{viewEvent.description}</p>
                            </div>
                        )}

                        <div className="modal-buttons" style={{ marginTop: "20px" }}>
                            <button
                                className="delete-btn-modal"
                                onClick={() => {
                                    deleteEvent(viewEvent.dateKey, viewEvent.id);
                                    setViewEvent(null);
                                }}
                            >
                                Löschen
                            </button>
                            <button className="save-btn" onClick={() => setViewEvent(null)}>Schließen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}