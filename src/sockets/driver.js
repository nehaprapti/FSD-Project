import {
  handleDriverLocationUpdate,
  setDriverAvailabilityStatus,
  respondToRideRequestByDriver,
  updateRideStatusByDriver
} from "../services/rides.service.js";

const toSocketErrorPayload = (eventName, error) => ({
  event: eventName,
  message: error?.message || "Socket event failed"
});

const runEvent = async ({ socket, eventName, callback, action }) => {
  try {
    const result = await action();
    if (typeof callback === "function") {
      callback({ success: true, data: result });
    }
  } catch (error) {
    socket.emit("socket:error", toSocketErrorPayload(eventName, error));
    if (typeof callback === "function") {
      callback({ success: false, message: error.message });
    }
  }
};

export const registerDriverSocketHandlers = (io, socket) => {
  socket.on("driver:location_update", (payload = {}, callback) => {
    runEvent({
      socket,
      eventName: "driver:location_update",
      callback,
      action: () =>
        handleDriverLocationUpdate({
          driverUserId: socket.userId,
          rideId: payload.rideId,
          latitude: payload.latitude,
          longitude: payload.longitude,
          speed: payload.speed,
          heading: payload.heading
        })
    });
  });

  socket.on("driver:availability", (payload = {}, callback) => {
    runEvent({
      socket,
      eventName: "driver:availability",
      callback,
      action: () =>
        setDriverAvailabilityStatus({
          driverUserId: socket.userId,
          availabilityStatus: payload.availabilityStatus ?? payload.online
        })
    });
  });

  socket.on("driver:ride_response", (payload = {}, callback) => {
    runEvent({
      socket,
      eventName: "driver:ride_response",
      callback,
      action: () =>
        respondToRideRequestByDriver({
          rideId: payload.rideId,
          driverUserId: socket.userId,
          response: payload.response
        })
    });
  });

  socket.on("ride:status_update", (payload = {}, callback) => {
    runEvent({
      socket,
      eventName: "ride:status_update",
      callback,
      action: () =>
        updateRideStatusByDriver({
          rideId: payload.rideId,
          driverUserId: socket.userId,
          status: payload.status,
          latitude: payload.latitude,
          longitude: payload.longitude,
          speed: payload.speed,
          heading: payload.heading
        })
    });
  });
};
