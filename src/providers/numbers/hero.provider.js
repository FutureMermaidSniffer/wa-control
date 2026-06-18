import BaseNumberProvider from './base.provider.js';
import { logger } from '../../utils/logger.js';

/**
 * HeroSMS provider (hero-sms.com)
 *
 * This service is a near drop-in replacement / clone of the SMS-Activate API style.
 * It supports the classic stubs/handler_api.php endpoint that Grizzly also uses.
 *
 * Base URL (stubs mode for maximum compatibility):
 *   https://hero-sms.com/stubs/handler_api.php
 *
 * Authentication: ?api_key=YOUR_KEY
 * Common actions: getNumber, getStatus, setStatus, getBalance
 *
 * Service code for WhatsApp: 'wa'
 * Country codes: same numeric IDs as SMS-Activate (US=12, UK=16, Czech=63, etc.)
 *
 * Response formats are the same plain-text style:
 *   ACCESS_NUMBER:1234567:+447700900123
 *   ACCESS_BALANCE:123.45
 */
export class HeroProvider extends BaseNumberProvider {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.apiKey || process.env.HERO_SMS_API_KEY;
    if (!this.apiKey) {
      throw new Error('HeroProvider requires apiKey (HERO_SMS_API_KEY env or config)');
    }
    this.baseUrl = 'https://hero-sms.com/stubs/handler_api.php';
  }

  get name() {
    return 'hero';
  }

  async _request(params) {
    const url = new URL(this.baseUrl);
    url.searchParams.set('api_key', this.apiKey);
    for (const [k, v] of Object.entries(params)) {
      if (v != null) url.searchParams.set(k, v);
    }

    const res = await fetch(url.toString());
    const text = (await res.text()).trim();

    if (!res.ok) {
      throw new Error(`HeroSMS HTTP ${res.status}: ${text}`);
    }

    // Same parsing logic as Grizzly / classic SMS-Activate stub
    if (text.startsWith('ACCESS_NUMBER:')) {
      const [, orderId, phone] = text.split(':');
      return { type: 'number', orderId: orderId.trim(), phone: phone.trim(), raw: text };
    }
    if (text.startsWith('ACCESS_BALANCE:')) {
      return { type: 'balance', balance: text.split(':')[1], raw: text };
    }
    return { type: 'raw', raw: text };
  }

  async acquireNumber({ country, service = 'wa' } = {}) {
    if (!country) {
      throw new Error('country is required for HeroSMS (numeric ID, e.g. 12=US, 16=UK, 63=Czech)');
    }

    const result = await this._request({
      action: 'getNumber',
      service,
      country,
    });

    if (result.type !== 'number') {
      throw new Error(`HeroSMS acquire failed: ${result.raw}`);
    }

    logger.info('HeroSMS number acquired', {
      country,
      phone: result.phone,
      orderId: result.orderId,
      provider: this.name,
    });

    return {
      orderId: result.orderId,
      phone: result.phone,
      country: Number(country),
      service,
      provider: this.name,
      raw: result.raw,
    };
  }

  async getSmsCode(orderId) {
    const result = await this._request({
      action: 'getStatus',
      id: orderId,
    });

    return {
      orderId,
      code: null, // many responses are STATUS_OK:123456 or similar — parse here if needed
      raw: result.raw,
      note: 'Poll this endpoint until the WhatsApp SMS code appears. Enter it in the emulator.',
    };
  }

  async getBalance() {
    const res = await this._request({ action: 'getBalance' });
    return res;
  }

  async setStatus(orderId, status) {
    return this._request({ action: 'setStatus', id: orderId, status });
  }
}

export default HeroProvider;
