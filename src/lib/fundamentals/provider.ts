import { getMockFundamentals } from "@/lib/demo-data";
import type { Fundamentals } from "@/types/trading";

export interface FundamentalsProvider {
  getFundamentals(symbol: string): Promise<Fundamentals>;
}

export class MockFundamentalsProvider implements FundamentalsProvider {
  async getFundamentals(symbol: string) {
    return getMockFundamentals(symbol);
  }
}

let provider: FundamentalsProvider | null = null;

export function getFundamentalsProvider() {
  if (!provider) provider = new MockFundamentalsProvider();
  return provider;
}
