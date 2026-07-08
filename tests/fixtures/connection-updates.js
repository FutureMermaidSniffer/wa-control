import { DisconnectReason } from '@whiskeysockets/baileys';

export function restartRequiredClose() {
  return {
    connection: 'close',
    lastDisconnect: {
      error: {
        message: 'restart required',
        output: { statusCode: DisconnectReason.restartRequired },
      },
    },
  };
}

export function connectionFailureClose(statusCode = 405) {
  return {
    connection: 'close',
    lastDisconnect: {
      error: {
        message: 'Connection Failure',
        output: { statusCode },
        data: { reason: 'Connection Failure' },
      },
    },
  };
}

export function loggedOutClose() {
  return {
    connection: 'close',
    lastDisconnect: {
      error: {
        message: 'logged out',
        output: { statusCode: DisconnectReason.loggedOut },
      },
    },
  };
}

export function connectingUpdate() {
  return { connection: 'connecting' };
}