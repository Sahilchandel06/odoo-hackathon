const router = require("express").Router();
const c = require("../controllers/teamController");

router.post("/", c.createTeam);
router.get("/", c.getTeams);

// NEW route used by RequestDetailPage
router.get("/:id/members", c.getTeamMembers);

module.exports = router;
