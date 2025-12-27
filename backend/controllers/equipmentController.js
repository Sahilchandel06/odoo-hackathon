const Equipment = require("../models/Equipment");
const Request = require("../models/MaintenanceRequest");

exports.createEquipment = async (req, res) => {
  res.json(await Equipment.create(req.body));
};

exports.getEquipment = async (req, res) => {
  res.json(await Equipment.find().populate("maintenanceTeam"));
};

exports.getEquipmentRequests = async (req, res) => {
  res.json(await Request.find({ equipment: req.params.id }));
};
