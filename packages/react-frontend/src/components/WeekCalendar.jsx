// src/components/WeekCalendar.jsx
import React, { useState, useEffect } from "react";
import { API_URL } from "../utils/api.js";
import WelcomeMessage from "./WelcomeMessage";
import EventInfoModal from "./EventInfoModal";
import Modal from "./Modal";
import CreateTaskForm from "./CreateTaskForm";
import "../styles/WeekCalendarView.css";

const WeekCalendarView = ({ initialSelectedDay, events, refreshEvents, onDaySelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(initialSelectedDay || new Date());
  const [eventToEdit, setEventToEdit] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [modalPosition, setModalPosition] = useState({ top: 100, left: 100 });

  // duplicateds from currentdayview.jsx... needs to be extracted to utility function file
  const handleDelete = async (id) => {
    console.log("Delete event", id);

    // TODO: temporary delete confirmation - ideally, this should be a modal with styles
    const deleteConfirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!deleteConfirm) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete event");
      }
      await refreshEvents(); // re-fetch events after deletion
    } catch (error) {
      console.error("Error deleting event:", error);
      alert(`❌ Failed to delete event: ${error.message}`);
    }
  };

  useEffect(() => {
    if (onDaySelect) onDaySelect(selectedDay);
  }, [selectedDay, onDaySelect]);

  const currentYear = currentDate.getFullYear();

  const firstDayOfWeek = new Date(currentDate);
  while (firstDayOfWeek.getDay() !== 0) {
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 1);
  }

  const handlePrevWeek = () => {
    const prev = new Date(firstDayOfWeek);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(firstDayOfWeek);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const daysArray = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(firstDayOfWeek);
    day.setDate(firstDayOfWeek.getDate() + i);
    return day;
  });

  const handleDayClick = (day) => setSelectedDay(day);

  return (
    <div className="week-calendar-view">
      <div className="week-year-header">
        <div className="week-header-left">
          <img src="../hamburger.png" alt="Example" width="35" />
          <span>{currentDate.toLocaleString("default", { month: "long" })} {currentYear}</span>
        </div>
        <div className="week-header-right">
          <WelcomeMessage displayName={localStorage.getItem("name")} />
          <div className="week-nav-buttons">
            <button onClick={handlePrevWeek}>&lt;</button>
            <button onClick={handleNextWeek}>&gt;</button>
          </div>
        </div>
      </div>

      <div className="week-day-headers">
        <div className="time-column-header" />
        {daysArray.map((day, index) => (
          <div key={index}>
            {day.toLocaleDateString("default", { weekday: "short", day: "numeric" })}
          </div>
        ))}
      </div>

      <div className="week-grid-wrapper">
        <div className="time-column">
          <div className="time-label-spacer" />
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="time-label">
              {(hour % 12 || 12)} {hour < 12 ? "AM" : "PM"}
            </div>
          ))}
        </div>

        <div className="week-calendar-grid">
          {daysArray.map((day, dayIndex) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const now = new Date();
            const showNowLine =
              now.getFullYear() === day.getFullYear() &&
              now.getMonth() === day.getMonth() &&
              now.getDate() === day.getDate();

            const dayEvents = events;

            const positionedEvents = [];
            const filteredEvents = dayEvents
              .filter((event) => {
                const eventDate = new Date(event.date);
                return (
                  eventDate.getFullYear() === day.getFullYear() &&
                  eventDate.getMonth() === day.getMonth() &&
                  eventDate.getDate() === day.getDate()
                );
              })
              .sort((a, b) => new Date(a.date) - new Date(b.date));

            let i = 0;
            while (i < filteredEvents.length) {
              const group = [filteredEvents[i]];
              const groupEnd = new Date(filteredEvents[i].end_date || new Date(new Date(filteredEvents[i].date).getTime() + 30 * 60000));
              let j = i + 1;
              while (j < filteredEvents.length) {
                const nextStart = new Date(filteredEvents[j].date);
                if (nextStart < groupEnd) {
                  group.push(filteredEvents[j]);
                  j++;
                } else {
                  break;
                }
              }

              group.forEach((event, index) => {
                positionedEvents.push({ event, index, total: group.length });
              });

              i = j;
            }

            return (
              <div
                key={dayIndex}
                className={`week-calendar-day${isToday ? " today" : ""}`}
                onClick={() => handleDayClick(day)}
              >
                <div className="hour-grid">
                  {Array.from({ length: 24 }, (_, hour) => (
                    <div key={hour} className="hour-slot" />
                  ))}
                </div>

                <div className="day-events-container">
                  {positionedEvents.map(({ event, index, total }, idx) => {
                    const start = new Date(event.date);
                    const end = event.end_date ? new Date(event.end_date) : new Date(start.getTime() + 30 * 60000);
                    let startHour = (start.getHours() + start.getMinutes() / 60);
                    startHour = Math.min(startHour, 23.49);
                    startHour = Math.round(startHour * 100) / 100;
                    const duration = Math.round(((end - start) / 60000 / 60) * 100) / 100;
                    const widthPercent = 100 / total;
                    const leftPercent = index * widthPercent;

                    return (
                      <div
                        key={idx}
                        className="event-block"
                        style={{
                          top: `calc(${startHour} * var(--slot-height))`,
                          height: `calc(${duration} * var(--slot-height))`,
                          width: `${widthPercent}%`,
                          left: `${leftPercent}%`
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setModalPosition({ top: rect.top + window.scrollY + 10, left: rect.left + window.scrollX + 10 });
                          setEventToEdit(event);
                          setShowInfoModal(true);
                        }}
                      >
                        {event.title}
                        <br />
                        {event.end_date
                          ? `${new Date(event.date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${new Date(event.end_date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                          : new Date(event.date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    );
                  })}
                  {showNowLine && (
                    <div
                      className="now-line"
                      style={{
                        top: `calc(${now.getHours() + now.getMinutes() / 60} * var(--slot-height))`,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showInfoModal && eventToEdit && (
        <EventInfoModal
          event={eventToEdit}
          position={modalPosition}
          onClose={() => {
            setEventToEdit(null);
            setShowInfoModal(false);
          }}
          onEdit={() => {
            setShowInfoModal(false);
            setShowEditModal(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {showEditModal && eventToEdit && (
        <Modal
          isOpen={showEditModal}
          onCloseRequested={() => {
            setShowEditModal(false);
            setEventToEdit(null);
          }}
          headerLabel="Edit Event"
        >
          <CreateTaskForm
            initialEvent={eventToEdit}
            onSubmit={() => {
              setShowEditModal(false);
              setEventToEdit(null);
              refreshEvents();
            }}
            onCancel={() => {
              setShowEditModal(false);
              setEventToEdit(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default WeekCalendarView;