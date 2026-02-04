const interfaze = require("../services/interfazeService");

exports.generateSummary = async (req, res) => {
  try {
    const { image, text } = req.body;

    if (!image) {
      return res.status(400).json({
        message: "Canvas image missing",
      });
    }

    const summary = await interfaze.generateSummary({
      image,
      prompt: text || "Summarize the whiteboard",
    });

    res.json({ summary });
  } catch (err) {
    console.error("❌ SUMMARY ERROR:", err.message);

    res.status(500).json({
      message: "Summary generation failed",
    });
  }
};
