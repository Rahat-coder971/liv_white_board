const Room = require("../models/Room");
const crypto = require("crypto");

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create({
      roomId: crypto.randomUUID(),
      createdBy: req.user.id
    });

    res.json(room);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomId: req.params.roomId
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    res.json(room);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
