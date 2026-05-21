import { io } from "socket.io-client";

let socket = null;

const getSocket = () => {
  if (!socket) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const socketUrl = apiUrl.replace("/api", "");
    
    socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.io server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  return socket;
};

export const joinZone = (zoneId) => {
  const socket = getSocket();
  console.log("[Socket] Joining zone:", zoneId, "Socket ID:", socket.id, "Connected:", socket.connected);
  socket.emit("join-zone", zoneId);
};

export const leaveZone = (zoneId) => {
  const socket = getSocket();
  console.log("[Socket] Leaving zone:", zoneId);
  socket.emit("leave-zone", zoneId);
};

export const onSlotBooked = (callback) => {
  const socket = getSocket();
  console.log("[Socket] Registering onSlotBooked listener");
  socket.on("slot-booked", (data) => {
    console.log("[Socket] Received slot-booked event:", data);
    callback(data);
  });
};

export const onSlotReleased = (callback) => {
  const socket = getSocket();
  console.log("[Socket] Registering onSlotReleased listener");
  socket.on("slot-released", (data) => {
    console.log("[Socket] Received slot-released event:", data);
    callback(data);
  });
};

export const removeSlotBookedListener = (callback) => {
  const socket = getSocket();
  socket.off("slot-booked", callback);
};

export const removeSlotReleasedListener = (callback) => {
  const socket = getSocket();
  socket.off("slot-released", callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default getSocket;
