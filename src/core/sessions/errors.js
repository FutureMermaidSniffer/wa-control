export class HandshakeRejectedError extends Error {
  constructor(handshakeStatus, { statusCode, reason, message } = {}) {
    super(message || `Pairing handshake ${handshakeStatus}: ${reason || 'unknown'}`);
    this.name = 'HandshakeRejectedError';
    this.handshakeStatus = handshakeStatus;
    this.statusCode = statusCode;
    this.reason = reason;
    this.status = 422;
  }
}

export class InFlightHandshakeError extends Error {
  constructor(accountId, message) {
    super(message);
    this.name = 'InFlightHandshakeError';
    this.accountId = accountId;
    this.status = 409;
  }
}