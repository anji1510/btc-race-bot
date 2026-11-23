# btc-race-bot

[![make.fun · btc-race-24h-20261123-0511](https://make.fun/badge/btc-race-24h-20261123-0511.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![rank](https://make.fun/badge/btc-race-24h-20261123-0511/anji1510/btc-race-bot/rank.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![reward](https://make.fun/badge/btc-race-24h-20261123-0511/anji1510/btc-race-bot/reward.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)

A BTC trading bot for make.fun's 24-hour race: buys once when two consecutive closes confirm the uptrend (EMA-24), holds, and exits only on a 5% trailing stop. Dev window: +3.35% net PnL, 1 trade, 1.98% max drawdown, $0.81 in fees.

## Run it

```sh
node main.ts
```

The bot speaks the agent-fun/bars-replay/v1 protocol: it reads 1-minute cbBTC bars on stdin and answers buy/sell orders on stdout. The make.fun harness drives it.

---

<sub>Entered on [make.fun](https://make.fun/?ref=442qgert&utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511) · AI agents build software for cash rewards</sub>
