import { useState, useEffect } from "react";
import { API_URL } from '../utils/api';
import "../styles/CreateTaskForm.css";
import PropTypes from "prop-types";

const CreateTaskForm = ({ onSubmit, onCancel, initialEvent }) => {
  // State variables for form inputs
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [eventType, setEventType] = useState("Regular");
  const [deadline, setDeadline] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [courseDept, setCourseDept] = useState("CSC");
  const [courseNo, setCourseNo] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [flag, setFlag] = useState("");
  const [endTime, setEndTime] = useState("");

  // Effect to populate form with initial event data if user is editing form
  useEffect(() => {
    if (initialEvent) {
      // Populate form with initial event data
      const dateObj = new Date(initialEvent.date);
      setDate(dateObj.toISOString().slice(0, 10));
      const timeString = dateObj.toString().split(" ")[4].slice(0, 5);
      setTime(timeString);

      setTitle(initialEvent.title);
      setDetails(initialEvent.details || "");

      // logic for setting form data based on event type from initialEvent
      if (initialEvent.deadline) {
        setEventType("Task");
        setDeadline(new Date(initialEvent.deadline).toISOString().slice(0, 10));
        setInProgress(initialEvent.in_progress);
      } else if (initialEvent.course_no) {
        setEventType("Academic");
        setCourseDept(initialEvent.course_no.dept);
        setCourseNo(initialEvent.course_no.no.toString());
      } else {
        setEventType("Regular");
      }

      // If editing, try to set endTime if available
      if (initialEvent.end_date) {
        const endDateObj = new Date(initialEvent.end_date);
        setEndTime(endDateObj.toTimeString().slice(0,5));
      }

      // Handle flag - if it's populated from backend, it might be a Flag object
      if (initialEvent.flags && initialEvent.flags.length > 0) {
        const firstFlag = initialEvent.flags[0];
        // If it's a populated Flag object, use flagname; otherwise use the string directly
        setFlag(firstFlag.flagname || firstFlag);
      }
    }
  }, [initialEvent]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dateTimeString = `${date}T${time}`;
    const eventDate = new Date(dateTimeString);
    const endDateTimeString = `${date}T${endTime}`;
    const endDate = endTime ? new Date(endDateTimeString) : null;

    // create event object
    const newEvent = {
      date: eventDate,
      flags: flag ? [flag] : [], // Send as string, let backend handle Flag creation/lookup
      visible: true,
      priority: {
        amount: 0,
        label: priority,
      },
      title,
      details,
    };

    if (initialEvent) {
      newEvent.id = initialEvent.id;
    }

    // Set specific properties based on event type (i.e. Task, Academic, Regular)
    if (eventType === "Task") {
      // TODO: for task, should there be a time deadline for the task or just a date?
      // Task event
      newEvent.date_created = new Date();
      newEvent.deadline = new Date(`${deadline}T${time}`);
      newEvent.in_progress = inProgress;
      newEvent.completed = false;
    } else if (eventType === "Academic") {
      newEvent.course_no = {
        dept: courseDept,
        no: parseInt(courseNo),
      };
      newEvent.start_date = eventDate;
      newEvent.end_date = endDate;
    } else {
      newEvent.all_day = false;
      newEvent.start_date = eventDate;
      newEvent.end_date = endDate;
      newEvent.length = 60;
    }

    // attempt POST or PUT request to backend
    try {
      const token = localStorage.getItem("token");
      //TODO: clean up API URL
      const method = initialEvent ? "PUT" : "POST";

      console.log("Method chosen:", method, "for event");

      const url = initialEvent
        ? `${API_URL}events/${initialEvent._id}`
        :  `${API_URL}events`;
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(`❌ Failed to create event: ${err.error}`);
        return;
      }

      const result = await response.json();
      console.log("Created event:", result);

      if (onSubmit) onSubmit(result);
    } catch (error) {
      console.error("Error submitting event:", error);
      alert("🚨 Network error. Please try again.");
    }
  };

  return (
    <form className="create-task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="eventDate">Date:</label>
        <input
          type="date"
          id="eventDate"
          name="eventDate"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="eventTime">Time:</label>
        <input
          type="time"
          id="eventTime"
          name="eventTime"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      {(eventType === "Regular" || eventType === "Academic") && (
        <div className="form-group">
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          name="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="eventType">Event Type:</label>
        <select
          id="eventType"
          name="eventType"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="Regular">Regular</option>
          <option value="Task">Task</option>
          <option value="Academic">Academic</option>
        </select>
      </div>
      {eventType === "Task" && (
        <>
          <div className="form-group">
            <label htmlFor="deadline">Deadline:</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="form-group checkbox-group">
            <label htmlFor="inProgress">In Progress:</label>
            <input
              type="checkbox"
              id="inProgress"
              name="inProgress"
              checked={inProgress}
              onChange={(e) => setInProgress(e.target.checked)}
            />
          </div>
        </>
      )}

      {eventType === "Academic" && (
        <>
          <div className="form-group">
            <label htmlFor="courseDept">Department:</label>
            <select
              id="courseDept"
              name="courseDept"
              value={courseDept}
              onChange={(e) => setCourseDept(e.target.value)}
            >
              <option value="CSC">CSC</option>
              <option value="CPE">CPE</option>
              <option value="EE">EE</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="courseNo">Course Number:</label>
            <input
              type="number"
              id="courseNo"
              name="courseNo"
              value={courseNo}
              onChange={(e) => setCourseNo(e.target.value)}
            />
          </div>
        </>
      )}
      <div className="form-group">
        <label htmlFor="flag">Flag:</label>
        <input
          type="text"
          id="flag"
          name="flag"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          placeholder="Enter a flag (optional)"
        />
      </div>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="details">Details:</label>
        <textarea
          id="details"
          name="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows="4"
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Create Event
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

CreateTaskForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  initialEvent: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    deadline: PropTypes.string,
    details: PropTypes.string,
    in_progress: PropTypes.bool,
    flags: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          flagname: PropTypes.string,
          _id: PropTypes.string,
        }),
      ])
    ),
    course_no: PropTypes.shape({
      dept: PropTypes.string,
      no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

export default CreateTaskForm;