const mongoose = require("mongoose");

module.exports = mongoose.model(
  "MaintenanceRequest",
  new mongoose.Schema({
    type: { type: String, enum: ["Corrective", "Preventive"] },
    subject: String,
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment" },
    maintenanceTeam: { type: mongoose.Schema.Types.ObjectId, ref: "MaintenanceTeam" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    scheduledDate: Date,
    duration: Number,
    status: {
      type: String,
      enum: ["New", "In Progress", "Repaired", "Scrap"],
      default: "New"
    }
  }, { timestamps: true })
);
