// models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  fileUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
