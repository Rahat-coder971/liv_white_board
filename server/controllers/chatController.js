const Message = require("../models/Message");


// SAVE MESSAGE
exports.saveMessage = async ({ roomId, userId, username, message }) => {
  await Message.create({
    roomId,
    sender: userId,
    username,
    message
  });
};


// GET CHAT HISTORY
exports.getMessages = async (roomId) => {
  return await Message.find({ roomId }).sort({ createdAt: 1 });
};
