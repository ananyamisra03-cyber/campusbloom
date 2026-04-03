const express = require("express");
const Data    = require("../models/Data");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

const ALLOWED_KEYS = [
  "expenses","budgets","tasks","marks","studiesSubjects","revisions",
  "timerSessions","habits","exams","materials","notes","todos",
  "internships","extracurriculars",
];

// Helper: find-or-create data doc
const getDoc = async (userId) => {
  let doc = await Data.findOne({ userId });
  if (!doc) doc = await Data.create({ userId });
  return doc;
};

// ── GET /api/data  —  load everything ────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const doc = await getDoc(req.user._id);
    const out = {};
    for (const key of ALLOWED_KEYS) out[key] = doc[key] ?? [];
    res.json(out);
  } catch (err) {
    console.error("Data GET error:", err);
    res.status(500).json({ message: "Failed to load data." });
  }
});

// ── PATCH /api/data/:key  —  update a single feature ─────────────────────────
router.patch("/:key", async (req, res) => {
  try {
    const { key } = req.params;
    if (!ALLOWED_KEYS.includes(key))
      return res.status(400).json({ message: `Invalid data key: ${key}` });
    if (req.body.value === undefined)
      return res.status(400).json({ message: "Body must contain { value }." });

    // Use $set with markModified so Mixed fields are saved correctly
    const doc = await Data.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { [key]: req.body.value } },
      { new: true, upsert: true }
    );
    res.json({ ok: true, [key]: doc[key] });
  } catch (err) {
    console.error(`Data PATCH /${err} error:`, err);
    res.status(500).json({ message: "Save failed." });
  }
});

// ── PATCH /api/data  —  bulk update multiple keys at once ────────────────────
router.patch("/", async (req, res) => {
  try {
    const updates = {};
    for (const key of ALLOWED_KEYS) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (!Object.keys(updates).length)
      return res.status(400).json({ message: "No valid keys to update." });

    await Data.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Data bulk PATCH error:", err);
    res.status(500).json({ message: "Bulk save failed." });
  }
});

module.exports = router;
