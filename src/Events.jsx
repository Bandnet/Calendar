import React from 'react';

const COLORS = {
    green: "#59e24a",
    blue: "#4a8fe2",
    red: "#e24a4a",
    orange: "#e28a4a",
    yellow: "#e2d84a",
    purple: "#9a4ae2",
    pink: "#e24ab0"
};

const DARK_COLORS = {
    green: "#3da132",
    blue: "#2a5fa2",
    red: "#b33535",
    orange: "#b36b35",
    yellow: "#b3a835",
    purple: "#6d32a1",
    pink: "#b3358a"
};

export default function Events({
                                   clickDay,
                                   getWeekDays,
                                   today,
                                   month,
                                   months,
                                   weekDaysNames,
                                   events,
                                   addEvent,
                                   openViewModal // Die neue Prop für das Detail-Modal
                               }) {
    return (
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
                                {events[d.key]
                                    ?.slice() // Kopie erstellen, um State nicht direkt zu mutieren
                                    .sort((a, b) => (a.time > b.time ? 1 : -1)) // Sortierung nach Uhrzeit
                                    .map((ev) => (
                                        <div
                                            key={ev.id}
                                            className="mini-event"
                                            style={{
                                                backgroundColor: COLORS[ev.color] || COLORS.green,
                                                borderLeft: `solid 5px ${DARK_COLORS[ev.color] || COLORS.green}`,

                                            }}
                                            onClick={() => openViewModal(ev, d.key)}
                                        >
                                            <div className="event-main-info">
                                                <span className="event-text">
                                                    {ev.time && <small className="event-time">{ev.time}</small>}
                                                    <strong>{ev.title}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="no-selection-msg">
                        Select a day in the calendar to view the week overview
                    </div>
                )}
            </div>
        </div>
    );
}