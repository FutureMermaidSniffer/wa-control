import BaseNumberProvider from './base.provider.js';

/**
 * Manual provider.
 *
 * Use this when the operator (or external automation) has already:
 * - Obtained a virtual number from ANY provider (Grizzly, SMS-Activate, dashboard, etc.)
 * - Launched their emulator using their own --account <phone> tooling
 * - Completed the WhatsApp registration by receiving the SMS code (from the provider)
 *   and entering it inside WhatsApp running in the emulator.
 *
 * This lets the user "add" / "contact" the number into wa-control as a ready-to-link asset
 * without the system trying to re-acquire or re-start the registration flow.
 */
export class ManualProvider extends BaseNumberProvider {
  get name() {
    return 'manual';
  }

  async acquireNumber({ phone, notes, externalProvider, externalOrderId } = {}) {
    if (!phone) {
      throw new Error('Manual provider requires an explicit phone number');
    }

    // Normalize phone
    const normalized = phone.startsWith('+') ? phone : `+${phone.replace(/[^\d]/g, '')}`;

    return {
      orderId: externalOrderId || `manual-${Date.now()}`,
      phone: normalized,
      country: null, // unknown or provided in notes
      service: 'wa',
      provider: this.name,
      externalProvider: externalProvider || 'unknown',
      notes: notes || 'Manually registered via external emulator + provider SMS code',
      alreadyRegistered: true,   // key flag: WhatsApp registration already completed
    };
  }

  async getSmsCode(orderId) {
    // For manual, the code was already entered by the user externally.
    return {
      orderId,
      code: null,
      note: 'This number was added manually. The WhatsApp registration SMS code was already used outside this system.',
    };
  }

  async getBalance() {
    return { balance: 'N/A (manual)', note: 'Manual entries have no balance tracked by wa-control.' };
  }
}

export default ManualProvider;
