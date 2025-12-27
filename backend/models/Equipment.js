const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Equipment",
  new mongoose.Schema({
    name: String,
    serialNumber: String,
    department: String,
    location: String,
    purchaseDate: Date,
    warrantyExpiry: Date,
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    maintenanceTeam: { type: mongoose.Schema.Types.ObjectId, ref: "MaintenanceTeam" },
    defaultTechnician: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isScrapped: { type: Boolean, default: false }
  })
);
