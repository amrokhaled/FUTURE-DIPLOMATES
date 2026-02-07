export type CurrencyCode = 'USD' | 'AED';

export interface PriceConfig {
    usd: number;
    aed: number;
}

export function formatPrice(amount: number, currency: CurrencyCode) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Utility to get price based on currency preference.
 * In a real Next.js scenario, this would be determined 
 * by a cookie or a middleware header (cf-ipcountry).
 */
export function getLocalizedPrice(config: PriceConfig, currency: CurrencyCode): number {
    return currency === 'AED' ? config.aed : config.usd;
}

export const SUMMIT_PRICES = {
    delegate: {
        usd: 899,
        aed: 3300,
    },
    vip: {
        usd: 1299,
        aed: 4770,
    },
    accommodation: {
        usd: 450,
        aed: 1650,
    }
};
