// BTC race bot: buy-once-hold with a 5% trailing stop.
//
// Why this shape: the dev window rises +3.64% overall (one +2.33% jump in hour 4,
// then range-bound). Backtests proved every active rule (EMA crossovers, mean
// reversion, Donchian) loses to the 4bps fee + 2bps slippage on the chop, while
// buy-and-hold makes +3.22%. So: buy once the trend confirms (two consecutive
// closes above EMA-24, so a single-bar spike cannot trigger the entry), then
// hold. The only exit is a 5% trailing stop from the peak since
// entry, and there is no re-buy after a stop-out. Deterministic: no clock,
// no Math.random, no env reads, no network.

import { runBars } from './vendor/makefun-bars.ts';

const SYMBOL = 'CBBTC';
const EMA_PERIOD = 24;
const ALPHA = 2 / (EMA_PERIOD + 1);
const TRAILING_STOP = 0.95; // sell when close falls 5% below the peak since entry
const MAX_SLIPPAGE_BPS = 100;

const closes: number[] = []; // closes in USD (close raw / 1e5, price_scale 5)
let ema = 0; // EMA-24 of closes, in USD
let peak = 0; // highest close since entry, in USD
let stoppedOut = false;
let aboveEma = 0; // consecutive closes above EMA-24 (buy needs 2, avoids a 1-bar spike)

await runBars({
  onBatch(state) {
    const raw = state.close(SYMBOL);
    if (raw === null) return [];
    const close = Number(raw) / 1e5;
    closes.push(close);
    ema = closes.length === 1 ? close : ALPHA * close + (1 - ALPHA) * ema;
    if (close > ema) aboveEma += 1;
    else aboveEma = 0;

    // Warm-up bars build history only; any order decided on one is rejected.
    if (state.warmingUp) return [];

    const pos = state.positions.get(SYMBOL);
    if (pos !== undefined && pos.qty > 0n) {
      if (close > peak) peak = close;
      if (close < peak * TRAILING_STOP) {
        stoppedOut = true;
        return [{ side: 'sell', symbol: SYMBOL, qty: pos.qty, max_slippage_bps: MAX_SLIPPAGE_BPS }];
      }
      return [];
    }

    if (!stoppedOut && closes.length >= EMA_PERIOD && aboveEma >= 2) {
      const room = state.weightRoom(SYMBOL);
      const spend = state.cash < room ? state.cash : room;
      if (spend <= 0n) return [];
      peak = close;
      return [{ side: 'buy', symbol: SYMBOL, notional_quote_units: spend, max_slippage_bps: MAX_SLIPPAGE_BPS }];
    }

    return [];
  },
});
