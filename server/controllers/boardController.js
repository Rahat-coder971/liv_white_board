const Room = require("../models/Room");


// SAVE STROKE
exports.saveStroke = async (roomId, stroke) => {
  await Room.updateOne(
    { roomId },
    { $push: { boardData: stroke } }
  );
};


// GET BOARD
exports.getBoard = async (roomId) => {
  const room = await Room.findOne({ roomId });
  return room?.boardData || [];
};


// CLEAR BOARD
exports.clearBoard = async (roomId) => {
  await Room.updateOne(
    { roomId },
    { $set: { boardData: [] } }
  );
};
