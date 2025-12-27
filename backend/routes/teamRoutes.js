const router = require("express").Router();
const c = require("../controllers/teamController");

router.post("/", c.createTeam);
router.get("/", c.getTeams);

module.exports = router;
