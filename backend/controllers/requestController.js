const Request = require("../models/MaintenanceRequest");
const Equipment = require("../models/Equipment");

// Create request (Corrective or Preventive)
exports.createRequest = async (req, res) => {
  const equipment = await Equipment.findById(req.body.equipment);
  if (!equipment) {
    return res.status(404).json({ message: "Equipment not found" });
  }

  const request = await Request.create({
    subject: req.body.subject,
    type: req.body.type, // "Corrective" or "Preventive"
    equipment: equipment._id,
    maintenanceTeam: equipment.maintenanceTeam,
    scheduledDate: req.body.scheduledDate || null,
  });

  res.json(request);
};

// Update request (status, duration, assignedTo, etc.)
exports.updateRequest = async (req, res) => {
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  // Scrap logic: mark equipment as scrapped
  if (req.body.status === "Scrap") {
    await Equipment.findByIdAndUpdate(request.equipment, { isScrapped: true });
  }

  return res.json(request);
};

// Get all requests (with equipment + technician + overdue flag)
exports.getRequests = async (req, res) => {
  const requests = await Request.find()
    .populate("equipment")
    .populate("assignedTo")
    .populate("maintenanceTeam");

  const final = requests.map((r) => ({
    ...r._doc,
    isOverdue:
      r.scheduledDate &&
      r.scheduledDate < new Date() &&
      r.status !== "Repaired" &&
      r.status !== "Scrap",
  }));

  res.json(final);
};
