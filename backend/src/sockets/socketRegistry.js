const socketById = new Map();
const socketIdsByUserId = new Map();
const socketIdsByRole = new Map();
const socketIdsByRoleAndUser = new Map();
let ioServer = null;

const makeKey = (role, userId) => `${role}:${userId}`;

export const setSocketServer = (io) => {
  ioServer = io;
};

export const registerSocketConnection = ({ socketId, role, userId, namespace = "/" }) => {
  if (!socketId || !role || !userId) {
    return;
  }

  socketById.set(socketId, { role, userId, namespace });

  if (!socketIdsByUserId.has(userId)) {
    socketIdsByUserId.set(userId, new Set());
  }
  socketIdsByUserId.get(userId).add(socketId);

  if (!socketIdsByRole.has(role)) {
    socketIdsByRole.set(role, new Set());
  }
  socketIdsByRole.get(role).add(socketId);

  const key = makeKey(role, userId);
  if (!socketIdsByRoleAndUser.has(key)) {
    socketIdsByRoleAndUser.set(key, new Set());
  }

  socketIdsByRoleAndUser.get(key).add(socketId);
};

export const unregisterSocketConnection = (socketId) => {
  const meta = socketById.get(socketId);
  if (!meta) {
    return;
  }

  socketById.delete(socketId);

  const userSocketSet = socketIdsByUserId.get(meta.userId);
  if (userSocketSet) {
    userSocketSet.delete(socketId);
    if (userSocketSet.size === 0) {
      socketIdsByUserId.delete(meta.userId);
    }
  }

  const roleSocketSet = socketIdsByRole.get(meta.role);
  if (roleSocketSet) {
    roleSocketSet.delete(socketId);
    if (roleSocketSet.size === 0) {
      socketIdsByRole.delete(meta.role);
    }
  }

  const key = makeKey(meta.role, meta.userId);
  const socketSet = socketIdsByRoleAndUser.get(key);
  if (!socketSet) {
    return;
  }

  socketSet.delete(socketId);
  if (socketSet.size === 0) {
    socketIdsByRoleAndUser.delete(key);
  }
};

export const emitToUser = (userId, eventName, payload) => {
  if (!ioServer || !userId || !eventName) {
    return false;
  }

  const socketSet = socketIdsByUserId.get(String(userId));
  if (!socketSet || socketSet.size === 0) {
    return false;
  }

  for (const socketId of socketSet) {
    const meta = socketById.get(socketId);
    if (meta && meta.namespace) {
      ioServer.of(meta.namespace).to(socketId).emit(eventName, payload);
    } else {
      ioServer.to(socketId).emit(eventName, payload);
    }
  }

  return true;
};

export const emitToRole = (role, eventName, payload) => {
  if (!ioServer || !role || !eventName) {
    return false;
  }

  const socketSet = socketIdsByRole.get(role);
  if (!socketSet || socketSet.size === 0) {
    return false;
  }

  for (const socketId of socketSet) {
    const meta = socketById.get(socketId);
    if (meta && meta.namespace) {
      ioServer.of(meta.namespace).to(socketId).emit(eventName, payload);
    } else {
      ioServer.to(socketId).emit(eventName, payload);
    }
  }

  return true;
};

export const emitToRoleUser = (role, userId, eventName, payload) => {
  if (!ioServer || !role || !userId || !eventName) {
    return false;
  }

  const key = makeKey(role, userId);
  const socketSet = socketIdsByRoleAndUser.get(key);
  if (!socketSet || socketSet.size === 0) {
    return false;
  }

  for (const socketId of socketSet) {
    const meta = socketById.get(socketId);
    if (meta && meta.namespace) {
      ioServer.of(meta.namespace).to(socketId).emit(eventName, payload);
    } else {
      ioServer.to(socketId).emit(eventName, payload);
    }
  }

  return true;
};
