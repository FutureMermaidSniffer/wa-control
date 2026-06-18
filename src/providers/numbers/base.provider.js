/**
 * Base interface for Virtual Number Providers used to obtain phone numbers
 * and receive WhatsApp registration SMS codes.
 *
 * Different providers (GrizzlySMS, SMS-Activate, 5SIM, TigerSMS, custom, etc.)
 * will implement this.
 *
 * The flow is typically:
 * 1. acquireNumber({ country, service: 'wa' }) -> { orderId, phone }
 * 2. (User or automation starts WhatsApp registration in emulator with the phone)
 * 3. getSmsCode(orderId) or poll until the WhatsApp registration code arrives.
 * 4. User enters the code in WhatsApp inside the emulator.
 * 5. Once WhatsApp is fully registered on that number, mark as ready.
 * 6. Later: release / cancel if not used.
 */

export class BaseNumberProvider {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Acquire a number for WhatsApp registration.
   * @param {object} opts
   * @param {number|string} opts.country - provider-specific country code (e.g. 12 for US in Grizzly)
   * @param {string} [opts.service='wa']
   * @returns {Promise<{orderId: string, phone: string, raw?: any}>}
   */
  async acquireNumber(opts = {}) {
    throw new Error('acquireNumber() must be implemented by provider');
  }

  /**
   * Get the SMS code for a pending order (the WhatsApp registration code).
   * Many providers require polling this.
   */
  async getSmsCode(orderId) {
    throw new Error('getSmsCode() must be implemented by provider (or return manual entry)');
  }

  /**
   * Optional: Get current account balance.
   */
  async getBalance() {
    return { balance: null, currency: null };
  }

  /**
   * Mark order as finished / cancel it.
   * Common status codes depend on provider (e.g. 6=success, 8=cancel).
   */
  async setStatus(orderId, status) {
    // no-op by default for providers that don't support it
  }

  /**
   * Human friendly name of the provider.
   */
  get name() {
    return 'base';
  }
}

export default BaseNumberProvider;
