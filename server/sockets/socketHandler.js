const jwt = require("jsonwebtoken");

const chatController = require("../controllers/chatController");
const boardController = require("../controllers/boardController");

module.exports = (io) => {

  // AUTH
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Auth error"));
    }
  });

  io.on("connection", (socket) => {

    // JOIN ROOM
    socket.on("join-room", async ({ roomId, username }) => {
      socket.join(roomId);

      // load chat
      const messages =
        await chatController.getMessages(roomId);
      socket.emit("chat-history", messages);

      // load board
      const board =
        await boardController.getBoard(roomId);
      socket.emit("board-history", board);
    });

    // CHAT
    socket.on("chat-message", async ({ roomId, message, username }) => {
      await chatController.saveMessage({
        roomId,
        userId: socket.user.id,
        username,
        message
      });

      io.to(roomId).emit("chat-message", {
        username,
        message,
        time: new Date().toLocaleTimeString()
      });
    });

    // DRAW
    socket.on("draw", async ({ roomId, stroke }) => {
      await boardController.saveStroke(roomId, stroke);
      socket.to(roomId).emit("draw", stroke);
    });

    // CLEAR BOARD
    socket.on("clear-board", async ({ roomId }) => {
      await boardController.clearBoard(roomId);
      io.to(roomId).emit("clear-board");
    });

  });
};
