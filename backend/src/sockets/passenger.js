export const registerPassengerSocketHandlers = (io, socket) => {
  socket.on("passenger:ping", (payload = {}, callback) => {
    if (typeof callback === "function") {
      callback({
        success: true,
        data: {
          socketId: socket.id,
          role: socket.role,
          userId: socket.userId,
          receivedAt: new Date().toISOString(),
          ...payload
        }
      });
    }
  });
};
