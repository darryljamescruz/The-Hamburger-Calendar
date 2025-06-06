import Calendar from "../models/calendar_new.js";
import { authenticateUser } from "./Auth.js";
import express from "express";
import cors from "cors";
import User from "../models/user.js";
import Event from "../models/event.js";
import Reminder from "../models/reminder.js";
import mongoose from "mongoose";

const router = express.Router();
router.use(cors());
router.use(express.json());

// Add event data
router.post("/", authenticateUser, async (req, res) => {
  try {
    const email = req.user.email; // get user email
    console.log("User email:", email);
    const user = await User.findOne({ email }).populate("calendars"); // find user by email and populate calendars

    if (!user || user.calendars.length === 0) {
      return res.status(404).json({ error: "User or calendars not found." });
    }

    const calendar = user.calendars[0]; // get first calendar by default (in future, change)
    const eventData = req.body; // get event data from request body

    const newEvent = new Event(eventData);
    await newEvent.save();

    calendar.events.push(newEvent._id);
    await calendar.save();

    // Determine event details to send with reminder
    let details = "";
    if (newEvent.details) {
      details = `: ${newEvent.details}`;
    } else {
      details = ": No additional details provided";
    }

    // Determine when to send reminder (1 hour before start time of event)
    const reminderTime = new Date(newEvent.start_date);
    reminderTime.setHours(reminderTime.getHours() - 1);

    const reminder = new Reminder({
      recipient_email: email,
      email_body: `Upcoming Event: ${newEvent.title} on ${newEvent.start_date}${details}`,
      send_at: reminderTime,
      event_id: newEvent._id, // save ID of associated event
    });

    await reminder.save();
    console.log(`[Reminder] Event reminder scheduled for ${reminder.send_at}`);
    console.log(reminder);

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get event data
router.get("/", authenticateUser, async (req, res) => {
  try {
    const email = req.user.email;
    //console.log("User found for get events api:", email);

    // Find the user by email and populate the calendars and events
    const user = await User.findOne({ email }).populate({
      path: "calendars",
      populate: {
        path: "events",
      },
    });

    // Check if the user and calendars exist
    if (!user || user.calendars.length === 0) {
      return res.status(404).json({ error: "User or calendars not found." });
    }

    // Get the first calendar and its events
    const calendar = user.calendars[0];
    const events = calendar.events || [];

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Add this route to your events routes file (probably in routes/events.js or similar)

// // GET /api/events/flags - Get all unique flags for the authenticated user
router.get('/flags', authenticateUser, async (req, res) => {
  try {
    const email = req.user.email;

    // Find the user and their calendars + events
    const user = await User.findOne({ email }).populate({
      path: "calendars",
      populate: {
        path: "events",
      },
    });

    if (!user || user.calendars.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User or calendars not found.",
      });
    }

    // Collect flags only from this user's events
    const flagSet = new Set();

    user.calendars.forEach((calendar) => {
      calendar.events.forEach((event) => {
        if (event.flags && Array.isArray(event.flags)) {
          event.flags.forEach((flag) => {
            if (flag && typeof flag === "string" && flag.trim()) {
              flagSet.add(flag.trim());
            }
          });
        }
      });
    });

    const uniqueFlags = Array.from(flagSet).sort();

    res.json({
      success: true,
      flags: uniqueFlags,
      count: uniqueFlags.length,
    });
  } catch (error) {
    console.error("Error fetching flags:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch flags",
    });
  }
});

// Delete event data
router.delete("/:id", authenticateUser, async (req, res) => {
  // TODO: the event needs to be deleted from the calendar array as well
  const { id } = req.params;
  console.log("Deleting event with ID:", id);

  if (!id) {
    return res.status(400).json({ error: "Event ID is required." });
  }
  try {
    const deletedEvent = await Event.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Now remove this event’s ID from the user’s calendar
    const email = req.user.email;
    const user = await User.findOne({ email }).populate("calendars");
    const calendar = user.calendars[0]; // assuming single calendar
    const eventIndex = calendar.events.indexOf(id);
    if (eventIndex > -1) {
      calendar.events.splice(eventIndex, 1);
      await calendar.save();
    }

    // Now remove this event's reminder from the database
    const deleteReminder = await Reminder.findOneAndDelete({
      event_id: new mongoose.Types.ObjectId(id),
    });
    if (!deleteReminder) {
      return res.status(404).json({ error: "Reminder not found." });
    }

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Update event data
router.put("/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  console.log("Updating event with ID:", id);
  // follows same logic in POST event, but updates event by ID
  try {
    const updatedEventData = req.body;

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      updatedEventData,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Determine event details to send with updated reminder
    let details = "";
    if (updatedEvent.details) {
      details = `: ${updatedEvent.details}`;
    } else {
      details = ": No additional details provided";
    }

    // Determine when to send reminder (1 hour before start time of event)
    const reminderTime = new Date(updatedEvent.start_date);
    reminderTime.setHours(reminderTime.getHours() - 1);

    // Update reminder data
    const updatedReminder = await Reminder.findOneAndUpdate(
      { event_id: id },
      {
        $set: {
          send_at: reminderTime,
          email_body: `Upcoming event: ${updatedEvent.title} on ${updatedEvent.start_date}${details}`,
          sent: false,
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Event updated successfully.", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
