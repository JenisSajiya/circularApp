//backend/routes/events.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const Event = require("../models/Event"); // your Event model
const protectAdmin = require("../middleware/protectAdmin"); // ✅ import the admin protection middleware

const router = express.Router();

/**
 * POST /api/events
 * Only admins can create events
 * Expect JSON body with:
 *  - name, startDate, endDate, time, venue  (required)
 *  - description, category (optional)
 *  - fileUrl (optional) -- must be a string and a valid http(s) URL if provided
 */
router.post(
  "/",
  protectAdmin, // ✅ middleware to allow only admins
  [
    body("name").notEmpty().withMessage("name required"),
    body("startDate").notEmpty().withMessage("startDate required"),
    body("endDate").notEmpty().withMessage("endDate required"),
    body("time").notEmpty().withMessage("time required"),
    body("venue").notEmpty().withMessage("venue required"),
    body("fileUrl")
      .optional()
      .isString()
      .withMessage("fileUrl must be a string")
      .bail()
      .matches(/^https?:\/\/.+$/)
      .withMessage("fileUrl must be a valid http(s) URL"),
  ],
  async (req, res) => {
    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, startDate, endDate, time, venue, description, category, fileUrl } = req.body;

      const newEvent = new Event({
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        time,
        venue,
        description,
        category,
        fileUrl: fileUrl || null,
      });

      const savedEvent = await newEvent.save();
      return res.status(201).json(savedEvent);
    } catch (err) {
      console.error("POST /api/events error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// GET all events (accessible to everyone)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json(events);
  } catch (err) {
    console.error("GET /api/events error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
