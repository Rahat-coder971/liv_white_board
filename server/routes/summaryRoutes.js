const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { generateSummary } = require("../controllers/summaryController");

router.post("/", auth, generateSummary);

module.exports = router;
