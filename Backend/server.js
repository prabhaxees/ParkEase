const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const slotRoutes = require("./routes/slotRoutes");
const zoneRoutes = require("./routes/zoneRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

connectDB();

const app = express();

// CORS configuration for frontend deployment
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"]
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Create HTTP server for Socket.io
const httpServer = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ParkEase API Running", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({
    message: "ParkEase Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      slots: "/api/slots",
      zones: "/api/zones",
      bookings: "/api/bookings",
    },
  });
});

const PORT = process.env.PORT || 5000;

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-zone", (zoneId) => {
    socket.join(`zone-${zoneId}`);
    console.log(`✓ User ${socket.id} joined zone ${zoneId}`);
  });

  socket.on("leave-zone", (zoneId) => {
    socket.leave(`zone-${zoneId}`);
    console.log(`✗ User ${socket.id} left zone ${zoneId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
