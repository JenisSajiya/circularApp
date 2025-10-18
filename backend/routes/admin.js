// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protectAdmin = require("../middleware/protectAdmin"); // ensure this file exists and is correct

// POST /api/admin/role
// Body: { email: string, action: "grant" | "revoke" }
// Only accessible to admins (protectAdmin)
router.post("/role", protectAdmin, async (req, res) => {
  const { email, action } = req.body;

  if (!email || !["grant", "revoke"].includes(action)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "grant") {
      if (user.role === "admin") {
        return res.json({ message: "User is already an admin" });
      }
      user.role = "admin";
    } else {
      // revoke
      if (user.role !== "admin") {
        return res.json({ message: "User is not an admin" });
      }
      user.role = "student"; // must use 'student' to match your enum
    }

    await user.save();
    return res.json({ message: `Successfully ${action === "grant" ? "granted" : "revoked"} admin access` });
  } catch (err) {
    console.error("POST /api/admin/role error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
