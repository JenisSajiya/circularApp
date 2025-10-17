const jwt = require("jsonwebtoken");

const protectAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expect: "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protectAdmin;
