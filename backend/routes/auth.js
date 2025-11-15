//backend/routes/auth.js
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Debug endpoint
router.get("/_debug", (req, res) => {
  res.json({ ok: true, msg: "auth route mounted" });
});

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    // Role assignment
    let role = "student";
    if (email.endsWith("@tce.edu") && !email.includes("student")) role = "admin";

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("[auth] signup error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Use consistent secret from .env
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
}
});

module.exports = router;
