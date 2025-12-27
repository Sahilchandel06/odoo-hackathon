const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["Employee", "Technician", "Manager"],
    default: "Employee"
  },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "MaintenanceTeam" },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

module.exports = mongoose.model("User", userSchema);
