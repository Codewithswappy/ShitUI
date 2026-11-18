'use client';

import { useState, useEffect } from 'react';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  defaultRate: number; // relative to 1 USD
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', defaultRate: 1 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', defaultRate: 86.5 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', defaultRate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', defaultRate: 0.78 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', defaultRate: 1.41 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', defaultRate: 1.55 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', defaultRate: 1.34 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', defaultRate: 3.67 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', defaultRate: 154 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', defaultRate: 5.75 },
};

/**
 * Detect currency from browser timezone and navigator language
 */
export function detectUserCurrency(): string {
  if (typeof window === 'undefined') return 'USD';

  // 1. Check user override in localStorage
  const saved = localStorage.getItem('shitui_user_currency');
  if (saved && SUPPORTED_CURRENCIES[saved]) {
    return saved;
  }

  try {
    // 2. Check timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.startsWith('Asia/Kolkata')) return 'INR';
    if (tz.includes('London') || tz.startsWith('Europe/London')) return 'GBP';
    if (
      tz.startsWith('Europe/') &&
      !tz.includes('London') &&
      !tz.includes('Istanbul') &&
      !tz.includes('Moscow')
    ) {
      return 'EUR';
    }
    if (tz.startsWith('Australia/')) return 'AUD';
    if (tz.startsWith('Canada/') || tz.includes('Toronto') || tz.includes('Vancouver')) return 'CAD';
    if (tz.includes('Singapore')) return 'SGD';
    if (tz.includes('Dubai') || tz.includes('Muscat')) return 'AED';
    if (tz.startsWith('Asia/Tokyo')) return 'JPY';
    if (tz.includes('Sao_Paulo')) return 'BRL';

    // 3. Check browser language (e.g. 'en-IN', 'hi-IN')
    const lang = (navigator.languages?.[0] || navigator.language || '').toLowerCase();
    if (lang.includes('-in') || lang.startsWith('hi')) return 'INR';
    if (lang.includes('-gb')) return 'GBP';
    if (lang.includes('-ca')) return 'CAD';
    if (lang.includes('-au')) return 'AUD';
    if (lang.includes('-de') || lang.includes('-fr') || lang.includes('-es') || lang.includes('-it')) return 'EUR';
    if (lang.includes('-jp') || lang.startsWith('ja')) return 'JPY';
    if (lang.includes('-br') || lang.startsWith('pt-br')) return 'BRL';
    if (lang.includes('-ae')) return 'AED';
    if (lang.includes('-sg')) return 'SGD';
  } catch {
    // Fallback to USD
  }

  return 'USD';
}

interface RatesCache {
  timestamp: number;
  rates: Record<string, number>;
}

const RATES_CACHE_KEY = 'shitui_exchange_rates_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useCurrency() {
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const detected = detectUserCurrency();
    setCurrencyCode(detected);

    // Load cached exchange rates or fetch fresh ones
    const cached = localStorage.getItem(RATES_CACHE_KEY);
    if (cached) {
      try {
        const parsed: RatesCache = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.rates) {
          setRates(parsed.rates);
          setIsLoaded(true);
          return;
        }
      } catch {
        // Cache invalid, fetch fresh
      }
    }

    // Fetch live rates from open.er-api.com (public, zero API key required, reliable)
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setRates(data.rates);
          localStorage.setItem(
            RATES_CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), rates: data.rates })
          );
        }
      })
      .catch(() => {
        // Network offline or failed: use default fallback rates
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const changeCurrency = (code: string) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyCode(code);
      localStorage.setItem('shitui_user_currency', code);
    }
  };

  const currentConfig = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const currentRate = rates[currencyCode] || currentConfig.defaultRate;

  /**
   * Convert a USD amount to the active currency
   */
  const convert = (usdAmount: number) => {
    if (currencyCode === 'USD') {
      return {
        amount: usdAmount,
        formatted: `$${usdAmount.toLocaleString()}`,
        isUsd: true,
      };
    }

    const converted = Math.round(usdAmount * currentRate);
    // Format nicely with local symbol
    const formatted = `${currentConfig.symbol}${converted.toLocaleString()}`;

    return {
      amount: converted,
      formatted,
      isUsd: false,
    };
  };

  return {
    currencyCode,
    currencyConfig: currentConfig,
    rate: currentRate,
    isLoaded,
    changeCurrency,
    convert,
    supportedCurrencies: Object.values(SUPPORTED_CURRENCIES),
  };
}
