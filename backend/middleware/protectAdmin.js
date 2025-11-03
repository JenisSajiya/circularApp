//backend/middleware/protectAdmin.js
const jwt = require("jsonwebtoken");

const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized" });

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Verify using the same JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = decoded; // attach decoded info
    next();
  } catch (err) {
    console.error("protectAdmin error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protectAdmin;
