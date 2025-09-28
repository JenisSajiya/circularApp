const express = require("express");
const multer = require("multer");
const path = require("path");
const Event = require("../models/Event"); // your Event model

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// POST create event
router.post("/", upload.single("file"), async (req, res) => {
  const { name, startDate, endDate, time, venue, description, category } = req.body;

  const newEvent = new Event({
    name,
    startDate,
    endDate,
    time,
    venue,
    description,
    category,
    fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
  });

  await newEvent.save();
  res.json(newEvent);
});

// GET all events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

module.exports = router;
