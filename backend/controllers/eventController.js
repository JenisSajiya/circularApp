//backend/controllers/eventController.js

const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const { name, startDate, endDate, time, venue, description, category, fileUrl } = req.body;

    // Basic validation (you can expand this if needed)
    if (!name || !startDate || !endDate || !time || !venue) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Optional: validate URL format
    if (fileUrl && !/^https?:\/\/.+$/.test(fileUrl)) {
      return res.status(400).json({ message: "Invalid file URL format" });
    }

    const event = new Event({
      name,
      startDate,
      endDate,
      time,
      venue,
      description,
      category,
      fileUrl: fileUrl || null, // just store the drive link directly
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createEvent, getEvents };
