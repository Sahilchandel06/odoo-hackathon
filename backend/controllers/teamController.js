const Team = require("../models/MaintenanceTeam");

exports.createTeam = async (req, res) => {
  res.json(await Team.create(req.body));
};

exports.getTeams = async (req, res) => {
  res.json(await Team.find().populate("members"));
};
