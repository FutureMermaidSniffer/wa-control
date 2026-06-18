import BaseNumberProvider from './base.provider.js';
import { logger } from '../../utils/logger.js';

const BASE_URL = 'https://api.grizzlysms.com/stubs/handler_api.php';

export class GrizzlyProvider extends BaseNumberProvider {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.apiKey || process.env.GRIZZLY_API_KEY;
    if (!this.apiKey) {
      throw new Error('GrizzlyProvider requires apiKey (GRIZZLY_API_KEY env or config)');
    }
  }

  get name() {
    return 'grizzly';
  }

  async _request(params) {
    const url = new URL(BASE_URL);
    url.searchParams.set('api_key', this.apiKey);
    for (const [k, v] of Object.entries(params)) {
      if (v != null) url.searchParams.set(k, v);
    }

    const res = await fetch(url.toString());
    const text = (await res.text()).trim();

    if (!res.ok) {
      throw new Error(`Grizzly HTTP ${res.status}: ${text}`);
    }

    // Parse common response formats
    if (text.startsWith('ACCESS_NUMBER:')) {
      const [, orderId, phone] = text.split(':');
      return { type: 'number', orderId: orderId.trim(), phone: phone.trim(), raw: text };
    }
    if (text.startsWith('ACCESS_BALANCE:')) {
      return { type: 'balance', balance: text.split(':')[1], raw: text };
    }
    return { type: 'raw', raw: text };
  }

  async acquireNumber({ country, service = 'wa', maxPrice } = {}) {
    if (!country) throw new Error('country is required for Grizzly (e.g. 12=US, 16=UK, 63=Czech)');

    const params = {
      action: 'getNumber',
      service,
      country,
    };
    if (maxPrice != null && maxPrice !== '') {
      params.maxPrice = maxPrice; // Many SMS-Activate clones (incl. Grizzly) respect maxPrice for cost control
    }

    const result = await this._request(params);

    if (result.type !== 'number') {
      throw new Error(`Grizzly acquire failed: ${result.raw}`);
    }

    logger.info('Grizzly number acquired', { country, phone: result.phone, orderId: result.orderId, provider: this.name, maxPrice });

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

    let code = null;
    const raw = result.raw || '';

    // Common Grizzly / SMS-Activate clone responses:
    // STATUS_OK:123456
    // OK:123456
    // FULL_SMS:123456:...
    // Sometimes just the code or "ACCESS_CODE:..."
    const codeMatch = raw.match(/(?:STATUS_?OK|OK|ACCESS_CODE|FULL_SMS)[:\s]+([0-9A-Za-z-]{4,8})/i);
    if (codeMatch) {
      code = codeMatch[1];
    } else if (/^\d{4,8}$/.test(raw.trim())) {
      // Raw response is just the code
      code = raw.trim();
    }

    return {
      orderId,
      code,
      raw,
      note: code
        ? 'Code extracted from provider response.'
        : 'No code parsed yet. Poll again or check your Grizzly dashboard for the WhatsApp verification SMS. Enter the code inside the emulator (WhatsApp registration flow).',
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

export default GrizzlyProvider;
