# Architecture

## Application shape

- `src/app` contains Next.js App Router pages and API route handlers.
- `src/components` contains reusable terminal UI and chart components.
- `src/lib/broker` isolates broker integrations behind `BrokerMarketDataProvider`.
- `src/lib/fundamentals` isolates book-value and other fundamental data behind `FundamentalsProvider`.
- `src/lib/scanner` contains scanner conditions and scanner execution.
- `src/lib/recommendations` creates explainable recommendations from scanner results.
- `src/lib/ledger` converts recommendations into live P&L ledger rows.
- `prisma/schema.prisma` defines the production PostgreSQL data model.

## Broker integration

The app uses `getMarketDataProvider()`:

- `MockMarketDataProvider` is used when `USE_MOCK_MARKET_DATA=true` or Angel credentials are missing.
- `AngelSmartApiProvider` is used when server env vars are configured.

Implemented Angel SmartAPI calls:

- Session login with client code, password, API key, and TOTP.
- Symbol search.
- LTP/current quote.
- Historical candle data for chart timeframes.

The wrapper centralizes headers, retries can be added in `request()`, and session refresh can be expanded from the existing session cache.

## Scanner workflow

1. Resolve universe from full seed universe or user watchlist.
2. Fetch current market price from the broker provider.
3. Fetch book value per share from fundamentals provider.
4. Check `book_value_per_share > current_market_price`.
5. Save scanner result in the current store and return rows to the UI.
6. User creates a recommendation from a result.
7. Recommendation appears in the ledger.
8. Ledger recalculates live performance from the broker provider.

## Data persistence

The MVP includes an in-memory store so the UI works immediately. The Prisma schema is ready for replacing the store with PostgreSQL repositories for:

- users and sessions
- watchlists
- scanner runs/results
- recommendations and ledgers
- chart drawings
- historical candles and price snapshots

## Compliance

The product UI includes the required research-only disclaimer. Recommendation text is explainable and based on scanner conditions, not discretionary financial advice.
