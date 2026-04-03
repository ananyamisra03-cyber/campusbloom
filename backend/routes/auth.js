const express   = require("express");
const jwt       = require("jsonwebtoken");
const validator = require("validator");
const User      = require("../models/User");
const Data      = require("../models/Data");
const { protect } = require("../middleware/auth");
const { sendLoginNotification } = require("../config/email");

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, college } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required." });
    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email address." });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    if (name.trim().length < 2)
      return res.status(400).json({ message: "Name must be at least 2 characters." });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(409).json({ message: "An account with this email already exists. Please login." });

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      college: (college || "").trim(),
    });

    // Create empty data document for this user
    await Data.create({ userId: user._id });

    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toPublic() });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Incorrect email or password." });

    const token = signToken(user._id);

    // Fire-and-forget login email
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "unknown";
    sendLoginNotification(user.email, user.name, ip);

    res.json({ token, user: user.toPublic() });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user.toPublic() });
});

// ── PATCH /api/auth/preferences ──────────────────────────────────────────────
router.patch("/preferences", protect, async (req, res) => {
  try {
    const ALLOWED = ["points","dark","activeThemeId","ownedThemes","name","college"];
    const updates = {};
    for (const key of ALLOWED) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (!Object.keys(updates).length)
      return res.status(400).json({ message: "Nothing to update." });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ ok: true, user: user.toPublic() });
  } catch (err) {
    console.error("Preferences error:", err);
    res.status(500).json({ message: "Update failed." });
  }
});

module.exports = router;
