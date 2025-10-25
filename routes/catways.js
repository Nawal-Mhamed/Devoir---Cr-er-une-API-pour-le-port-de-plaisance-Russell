const express = require("express");
const router = express.Router();
const reservationRouter = require("./reservations");
const catwayController = require("../controllers/catwayController");

router.get("/", catwayController.getAllCatways);
router.get("/:id", catwayController.getByNumber);
router.post("/", catwayController.createCatway);
router.put("/:id", catwayController.updateCatway);
router.delete("/:id", catwayController.deleteCatway);

router.use("/:id/reservations", reservationRouter);

module.exports = router;
