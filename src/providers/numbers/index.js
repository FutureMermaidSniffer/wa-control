import GrizzlyProvider from './grizzly.provider.js';
import ManualProvider from './manual.provider.js';
import HeroProvider from './hero.provider.js';

/**
 * Registry of available virtual number providers.
 * Add new providers here (e.g. SmsActivateProvider, TigerProvider, HeroSMS, etc.).
 *
 * HeroSMS is a popular SMS-Activate compatible service.
 */
const PROVIDERS = {
  grizzly: GrizzlyProvider,
  hero: HeroProvider,
  manual: ManualProvider,
  // 'sms-activate': SmsActivateProvider,
  // '5sim': FiveSimProvider,
};

export function getProvider(name, config = {}) {
  const ProviderClass = PROVIDERS[name?.toLowerCase()];
  if (!ProviderClass) {
    throw new Error(`Unknown number provider: ${name}. Available: ${Object.keys(PROVIDERS).join(', ')}`);
  }
  return new ProviderClass(config);
}

export function listProviders() {
  return Object.keys(PROVIDERS);
}

export { BaseNumberProvider } from './base.provider.js';

export default { getProvider, listProviders };
