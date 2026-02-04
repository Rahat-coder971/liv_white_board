require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
connectDB();

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const summaryRoutes = require("./routes/summaryRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/summary", summaryRoutes);

const server = app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

require("./sockets/socketHandler")(io);
