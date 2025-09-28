// controllers/eventController.js
const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      fileUrl: req.file ? req.file.path : null,
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

