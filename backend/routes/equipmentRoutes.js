const router = require("express").Router();
const c = require("../controllers/equipmentController");

router.post("/", c.createEquipment);
router.get("/", c.getEquipment);
router.get("/:id/requests", c.getEquipmentRequests);

module.exports = router;
