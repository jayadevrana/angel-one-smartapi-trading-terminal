import { describe, expect, it } from "vitest";
import { calculatePnl, performanceLabel } from "@/lib/calculations";

describe("ledger calculations", () => {
  it("calculates quantity-aware P&L and percentage return", () => {
    expect(calculatePnl(100, 125, 10)).toEqual({ pnl: 250, pnlPercent: 25 });
  });

  it("labels strong performers and underperformers", () => {
    expect(performanceLabel(18)).toBe("Strong performer");
    expect(performanceLabel(-12)).toBe("Underperformer");
  });
});
