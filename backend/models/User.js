const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:        { type: String,  required: true,  trim: true, maxlength: 100 },
    email:       { type: String,  required: true,  unique: true, lowercase: true, trim: true },
    password:    { type: String,  required: true,  minlength: 6, select: false },
    college:     { type: String,  trim: true,      default: "" },
    points:      { type: Number,  default: 0,      min: 0 },
    dark:        { type: Boolean, default: false },
    activeThemeId: { type: Number, default: null },
    ownedThemes: [{ type: Number }],
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Safe public fields
userSchema.methods.toPublic = function () {
  return {
    id:           this._id,
    name:         this.name,
    email:        this.email,
    college:      this.college,
    points:       this.points,
    dark:         this.dark,
    activeThemeId:this.activeThemeId,
    ownedThemes:  this.ownedThemes,
  };
};

module.exports = mongoose.model("User", userSchema);
