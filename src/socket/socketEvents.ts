export const EVENTS = {
  CONNECTION: {
    CONNECT: "connection",
    DISCONNECT: "disconnect",
    ERROR: "error",
  },

  MESSAGE: {
    SEND: "message:send", // client → server (user sends message)
    DELIVERED: "message:delivered", // server → sender (saved in DB)
    NEW: "message:new", // server → receivers (after saved)
    SEEN: "message:seen", // client → server (user viewed)
    SEEN_UPDATE: "message:seen:update", // server → receiver (seen status update)
    EDIT: "message:edit", // client → server
    EDITED: "message:edited", // server → receiver
    DELETE: "message:delete", // client → server
    DELETED: "message:deleted", // server → receiver
  },

  ROOM: {
    JOIN: "conversation:join",
    LEAVE: "conversation:leave",
    JOINED: "conversation:joined",
    LEFT: "conversation:left",
  },

  USER: {
    ONLINE: "user:online",
    OFFLINE: "user:offline",
    STATUS: "user:status", // server tells online/offline status
  },

  DELIVERY: {
    TIMEOUT: "delivery:timeout", // optional event if client wants it
    FAILED: "delivery:failed",
    RETRY: "delivery:retry",
  },

  TYPING: {
    START: "typing:start",
    STOP: "typing:stop",
  },

  SYSTEM: {
    PING: "system:ping",
    PONG: "system:pong",
  },
} as const;
