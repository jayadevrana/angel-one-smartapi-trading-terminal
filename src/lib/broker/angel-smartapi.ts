import crypto from "node:crypto";
import type { BrokerMarketDataProvider } from "@/lib/broker/types";
import type { Candle, Quote, SymbolInfo, Timeframe } from "@/types/trading";

const baseUrl = "https://apiconnect.angelone.in";

type AngelSession = {
  jwtToken: string;
  refreshToken?: string;
  feedToken?: string;
  expiresAt: number;
};

export class AngelSmartApiProvider implements BrokerMarketDataProvider {
  private session: AngelSession | null = null;

  async searchSymbols(query: string): Promise<SymbolInfo[]> {
    const response = await this.request<{ data?: Array<{ symbol: string; tradingsymbol?: string; name?: string; exchange: string; symboltoken: string }> }>("/rest/secure/angelbroking/order/v1/searchScrip", {
      method: "POST",
      body: JSON.stringify({ exchange: "NSE", searchscrip: query }),
    });
    return (response.data || []).map((item) => ({
      symbol: (item.tradingsymbol || item.symbol).replace("-EQ", ""),
      tradingSymbol: item.tradingsymbol || item.symbol,
      companyName: item.name || item.symbol,
      exchange: item.exchange,
      token: item.symboltoken,
    }));
  }

  async getQuote(symbol: SymbolInfo): Promise<Quote> {
    const response = await this.request<{ data: { ltp: number; open?: number; high?: number; low?: number; close?: number; volume?: number } }>("/rest/secure/angelbroking/order/v1/getLtpData", {
      method: "POST",
      body: JSON.stringify({ exchange: symbol.exchange, tradingsymbol: symbol.tradingSymbol, symboltoken: symbol.token }),
    });
    const data = response.data;
    return {
      ...symbol,
      price: Number(data.ltp),
      open: Number(data.open ?? data.ltp),
      high: Number(data.high ?? data.ltp),
      low: Number(data.low ?? data.ltp),
      close: Number(data.close ?? data.ltp),
      volume: Number(data.volume ?? 0),
      capturedAt: new Date().toISOString(),
    };
  }

  async getHistoricalCandles(symbol: SymbolInfo, timeframe: Timeframe): Promise<Candle[]> {
    const to = new Date();
    const from = new Date(to.getTime() - lookbackMs(timeframe));
    const response = await this.request<{ data?: Array<[string, number, number, number, number, number]> }>("/rest/secure/angelbroking/historical/v1/getCandleData", {
      method: "POST",
      body: JSON.stringify({
        exchange: symbol.exchange,
        symboltoken: symbol.token,
        interval: toAngelInterval(timeframe),
        fromdate: formatAngelDate(from),
        todate: formatAngelDate(to),
      }),
    });
    return (response.data || []).map(([time, open, high, low, close, volume]) => ({ time, open, high, low, close, volume }));
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const session = await this.getSession();
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-UserType": "USER",
        "X-SourceID": "WEB",
        "X-ClientLocalIP": process.env.ANGEL_CLIENT_LOCAL_IP || "127.0.0.1",
        "X-ClientPublicIP": process.env.ANGEL_CLIENT_PUBLIC_IP || "127.0.0.1",
        "X-MACAddress": process.env.ANGEL_MAC_ADDRESS || "00:00:00:00:00:00",
        "X-PrivateKey": requiredEnv("ANGEL_API_KEY"),
        Authorization: `Bearer ${session.jwtToken}`,
        ...(init.headers || {}),
      },
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok || json.status === false) {
      throw new Error(json.message || `Angel API request failed: ${response.status}`);
    }
    return json as T;
  }

  private async getSession() {
    if (this.session && Date.now() < this.session.expiresAt) return this.session;
    const response = await fetch(`${baseUrl}/rest/auth/angelbroking/user/v1/loginByPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-UserType": "USER",
        "X-SourceID": "WEB",
        "X-ClientLocalIP": process.env.ANGEL_CLIENT_LOCAL_IP || "127.0.0.1",
        "X-ClientPublicIP": process.env.ANGEL_CLIENT_PUBLIC_IP || "127.0.0.1",
        "X-MACAddress": process.env.ANGEL_MAC_ADDRESS || "00:00:00:00:00:00",
        "X-PrivateKey": requiredEnv("ANGEL_API_KEY"),
      },
      body: JSON.stringify({
        clientcode: requiredEnv("ANGEL_CLIENT_CODE"),
        password: requiredEnv("ANGEL_PASSWORD"),
        totp: generateTotp(requiredEnv("ANGEL_TOTP_SECRET")),
      }),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok || json.status === false) throw new Error(json.message || "Angel SmartAPI login failed");
    this.session = {
      jwtToken: json.data.jwtToken,
      refreshToken: json.data.refreshToken,
      feedToken: json.data.feedToken,
      expiresAt: Date.now() + 1000 * 60 * 20,
    };
    return this.session;
  }
}

function toAngelInterval(timeframe: Timeframe) {
  const map: Record<Timeframe, string> = {
    "1m": "ONE_MINUTE",
    "5m": "FIVE_MINUTE",
    "15m": "FIFTEEN_MINUTE",
    "1h": "ONE_HOUR",
    "1D": "ONE_DAY",
    "1W": "ONE_WEEK",
  };
  return map[timeframe];
}

function lookbackMs(timeframe: Timeframe) {
  if (timeframe === "1D") return 1000 * 60 * 60 * 24 * 180;
  if (timeframe === "1W") return 1000 * 60 * 60 * 24 * 365 * 3;
  return 1000 * 60 * 60 * 24 * 5;
}

function formatAngelDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for Angel SmartAPI`);
  return value;
}

function generateTotp(secret: string) {
  const key = base32Decode(secret.replace(/\s/g, "").toUpperCase());
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const hmac = crypto.createHmac("sha1", key).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3];
  return String(code % 1000000).padStart(6, "0");
}

function base32Decode(input: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const char of input) bits += alphabet.indexOf(char).toString(2).padStart(5, "0");
  const bytes = bits.match(/.{1,8}/g)?.map((byte) => parseInt(byte.padEnd(8, "0"), 2)) || [];
  return Buffer.from(bytes);
}
