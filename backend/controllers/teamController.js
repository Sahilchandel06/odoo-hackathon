const Team = require("../models/MaintenanceTeam");

exports.createTeam = async (req, res) => {
  res.json(await Team.create(req.body));
};

exports.getTeams = async (req, res) => {
  res.json(await Team.find().populate("members"));
};

// NEW: return all members of one team
exports.getTeamMembers = async (req, res) => {
  const team = await Team.findById(req.params.id).populate("members");
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }
  res.json(team.members);
};
