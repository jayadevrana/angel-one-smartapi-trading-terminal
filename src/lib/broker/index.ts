import { AngelSmartApiProvider } from "@/lib/broker/angel-smartapi";
import type { BrokerMarketDataProvider } from "@/lib/broker/types";
import { MockMarketDataProvider } from "@/lib/broker/mock-provider";
import { envFlag } from "@/lib/env";

let provider: BrokerMarketDataProvider | null = null;

export function getMarketDataProvider() {
  if (!provider) {
    const shouldMock = envFlag("USE_MOCK_MARKET_DATA", true) || !process.env.ANGEL_API_KEY;
    provider = shouldMock ? new MockMarketDataProvider() : new AngelSmartApiProvider();
  }
  return provider;
}
