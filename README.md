# Angel Terminal

Professional stock research MVP for Angel One SmartAPI market data, TradingView-style charts, book-value scanning, recommendations, and live recommendation ledger P&L.

## What is included

- Next.js App Router with TypeScript and dark trading-terminal UI.
- Server-side Angel One SmartAPI wrapper for login, symbol search, LTP, and historical candles.
- Broker provider interface so another broker can be added later.
- Mock market data mode for local development.
- Mock fundamentals provider for book value per share until a real fundamentals API is connected.
- Book value scanner: `book_value_per_share > current_market_price`.
- Recommendation engine and explainable recommendation text.
- Ledger with live price, quantity-aware P&L, P&L percent, performance labels, and close action.
- Lightweight Charts candlestick/line chart with timeframes, crosshair, zoom/pan, and saved drawing markers.
- Prisma PostgreSQL schema for users, broker connection, symbols, watchlists, candles, scanner runs/results, recommendations, ledgers, drawings, and snapshots.

## Setup

```bash
cd angel-one-smartapi-trading-terminal
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Demo login:

- Email: `demo@terminal.local`
- Password: `demo1234`

## Angel SmartAPI

Put shared Angel credentials in `.env`:

```bash
ANGEL_API_KEY=""
ANGEL_CLIENT_CODE=""
ANGEL_PASSWORD=""
ANGEL_TOTP_SECRET=""
USE_MOCK_MARKET_DATA="false"
```

Credentials are read only on the server. They are not exposed as `NEXT_PUBLIC_*` values and are not hardcoded in source.

## Disclaimer

This platform is for research and analysis only. Recommendations are system-generated based on user-defined conditions and should not be treated as financial advice. Trading automation is infrastructure, not financial advice. No profit guarantees. Test in dry-run/paper before live.

## Author

Built by [Jayadev Rana](https://jayadevrana.in) — @bluealgocapital · [YouTube](https://www.youtube.com/@jayadevrana3657) · [GitHub](https://github.com/jayadevrana)
