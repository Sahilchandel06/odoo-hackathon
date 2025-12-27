const Request = require("../models/MaintenanceRequest");
const Equipment = require("../models/Equipment");

exports.createRequest = async (req, res) => {
  const equipment = await Equipment.findById(req.body.equipment);

  const request = await Request.create({
    subject: req.body.subject,
    type: req.body.type,
    equipment: equipment._id,
    maintenanceTeam: equipment.maintenanceTeam,
    scheduledDate: req.body.scheduledDate
  });

  res.json(request);
};

exports.updateRequest = async (req, res) => {
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (req.body.status === "Scrap") {
    await Equipment.findByIdAndUpdate(request.equipment, { isScrapped: true });
  }

  res.json(request);
};

exports.getRequests = async (req, res) => {
  const requests = await Request.find()
    .populate("equipment")
    .populate("assignedTo");

  const final = requests.map(r => ({
    ...r._doc,
    isOverdue:
      r.scheduledDate &&
      r.scheduledDate < new Date() &&
      r.status !== "Repaired"
  }));

  res.json(final);
};
