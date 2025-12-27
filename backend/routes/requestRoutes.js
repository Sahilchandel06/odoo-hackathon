const router = require("express").Router();
const c = require("../controllers/requestController");

router.post("/", c.createRequest);
router.get("/", c.getRequests);
router.patch("/:id", c.updateRequest);

module.exports = router;
