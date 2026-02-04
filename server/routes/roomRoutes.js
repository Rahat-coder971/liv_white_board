const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  createRoom,
  getRoom
} = require("../controllers/roomController");

router.post("/create", auth, createRoom);
router.get("/:roomId", auth, getRoom);

module.exports = router;
