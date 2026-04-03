const mongoose = require("mongoose");

/**
 * One document per user.  Each key stores a JSON array/object
 * for that feature.  Using Mixed type so we never need schema
 * migrations when we add new fields to sub-documents.
 */
const dataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    expenses:         { type: mongoose.Schema.Types.Mixed, default: [] },
    budgets:          { type: mongoose.Schema.Types.Mixed, default: {} },
    tasks:            { type: mongoose.Schema.Types.Mixed, default: [] },
    marks:            { type: mongoose.Schema.Types.Mixed, default: [] },
    studiesSubjects:  { type: mongoose.Schema.Types.Mixed, default: [] },
    revisions:        { type: mongoose.Schema.Types.Mixed, default: [] },
    timerSessions:    { type: mongoose.Schema.Types.Mixed, default: [] },
    habits:           { type: mongoose.Schema.Types.Mixed, default: [] },
    exams:            { type: mongoose.Schema.Types.Mixed, default: [] },
    materials:        { type: mongoose.Schema.Types.Mixed, default: [] },
    notes:            { type: mongoose.Schema.Types.Mixed, default: [] },
    todos:            { type: mongoose.Schema.Types.Mixed, default: [] },
    internships:      { type: mongoose.Schema.Types.Mixed, default: [] },
    extracurriculars: { type: mongoose.Schema.Types.Mixed, default: [] },
  },
  {
    timestamps: true,
    // required so Mongoose re-saves Mixed fields when they are mutated in-place
    strict: false,
  }
);

module.exports = mongoose.model("Data", dataSchema);
