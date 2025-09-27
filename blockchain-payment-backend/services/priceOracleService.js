class PriceOracleService {
  constructor() {
    // Static mock prices to avoid external dependencies at runtime
    this.pricesUSD = {
      MATIC: 0.5,
      ETH: 3000,
      BTC: 60000
    };
    this.fiatRatesUSD = {
      USD: 1,
      EUR: 0.92,
      INR: 83
    };
  }

  async getCryptoPrices(currency = 'USD') {
    const multiplier = 1 / (this.fiatRatesUSD[currency] || 1);
    const out = {};
    for (const [k, v] of Object.entries(this.pricesUSD)) {
      out[k] = Number((v * multiplier).toFixed(6));
    }
    return { currency, prices: out };
  }

  async getFiatRates(base = 'USD') {
    // Convert from USD table to requested base
    const baseRate = this.fiatRatesUSD[base] || 1;
    const rates = {};
    for (const [k, v] of Object.entries(this.fiatRatesUSD)) {
      rates[k] = Number((v / baseRate).toFixed(6));
    }
    return { base, rates };
  }

  async convertCurrency(amount, from = 'USD', to = 'USD') {
    const fromRate = this.fiatRatesUSD[from] || 1;
    const toRate = this.fiatRatesUSD[to] || 1;
    const inUSD = amount / fromRate;
    const result = inUSD * toRate;
    return { amount, from, to, result: Number(result.toFixed(6)) };
  }

  async getTokenPrice(symbol = 'MATIC', currency = 'USD') {
    const usd = this.pricesUSD[symbol.toUpperCase()] || this.pricesUSD.MATIC;
    const multiplier = 1 / (this.fiatRatesUSD[currency] || 1);
    return { symbol: symbol.toUpperCase(), currency, price: Number((usd * multiplier).toFixed(6)) };
  }
}

module.exports = PriceOracleService;