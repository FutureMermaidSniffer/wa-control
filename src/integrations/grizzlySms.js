/**
 * GrizzlySMS integration (https://grizzlysms.com/docs)
 * Uses the common "stubs/handler_api.php" style used by many virtual SMS providers.
 *
 * Supported countries (as provided by user):
 *   US: 12
 *   UK: 16
 *   Czech: 63
 *  Canada: 36
 *
 * Service for WhatsApp = 'wa'
 *
 * Typical responses:
 *   Success getNumber: "ACCESS_NUMBER:1234567:+447700900123"
 *   Errors: "NO_NUMBERS", "NO_BALANCE", etc.
 */

import { logger } from '../utils/logger.js';

const BASE = 'https://api.grizzlysms.com/stubs/handler_api.php';

export class GrizzlySmsClient {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('GrizzlySMS API key is required (set GRIZZLY_API_KEY in env or pass explicitly)');
    }
    this.apiKey = apiKey;
  }

  async _call(params) {
    const url = new URL(BASE);
    url.searchParams.set('api_key', this.apiKey);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });

    const res = await fetch(url.toString());
    const text = (await res.text()).trim();

    if (!res.ok) {
      throw new Error(`GrizzlySMS HTTP ${res.status}: ${text}`);
    }

    // Many of these APIs return plain text codes
    if (text.startsWith('ACCESS_NUMBER:')) {
      const [, orderId, phone] = text.split(':');
      return { ok: true, orderId: orderId.trim(), phone: phone.trim(), raw: text };
    }

    if (text.startsWith('ACCESS_BALANCE:')) {
      return { ok: true, balance: text.split(':')[1], raw: text };
    }

    // Error cases
    return { ok: false, error: text, raw: text };
  }

  /**
   * Get a number for WhatsApp.
   * @param {number|string} country - 12=US, 16=UK, 63=Czech (per user)
   * @param {string} service - 'wa' for WhatsApp
   */
  async getNumber(country, service = 'wa') {
    const result = await this._call({
      action: 'getNumber',
      service,
      country,
    });

    if (!result.ok) {
      throw new Error(`Grizzly getNumber failed: ${result.error}`);
    }

    logger.info('GrizzlySMS number acquired', { country, phone: result.phone, orderId: result.orderId });
    return {
      orderId: result.orderId,
      phone: result.phone,
      country: Number(country),
      service,
    };
  }

  /**
   * Get current balance (for UI display).
   */
  async getBalance() {
    const result = await this._call({ action: 'getBalance' });
    return result;
  }

  /**
   * Mark the order as complete / cancel etc.
   * Common statuses: 6 = success/complete, 8 = cancel
   */
  async setStatus(orderId, status) {
    return this._call({
      action: 'setStatus',
      id: orderId,
      status,
    });
  }
}

export default GrizzlySmsClient;
