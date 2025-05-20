/**
 * TradeDown.ts — V0.6
 * ------------------
 * ✔ Supports **buy / sell / query** TradeDown syntax.
 * ✔ Whitespace around operator is optional, e.g.:
 *      0xABC…+0.5bnb   (buy)
 *      0xABC…-100%     (sell)
 *      0xABC…          (query)
 * ✔ Supports EVM multi-chain and Solana addresses
 * ✔ Auto-detects chain (default: bsc for EVM, sol for Solana)
 *
 * Grammar:
 *   1. BUY/SELL  → ADDRESS OP VALUE[%] [UNIT]
 *   2. QUERY     → ADDRESS
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type Action = 'buy' | 'sell' | 'query';

export interface TradeDownCmd {
  mode: 'tradedown';
  action: Action;
  target: string;
  value?: number;
  chain: string;
  isPercent?: boolean;
  unit?: string;
}

export interface ParseError {
  code: 'INVALID_FORMAT' | 'INVALID_ADDRESS' | 'INVALID_VALUE';
  message: string;
}

/* -------------------------------------------------------------------------- */
/* Regexes                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Buy/Sell — address op value[%] unit?  (whitespace optional)
 * Groups: 1=addr 2=op 3=val 4=%? 5=unit?
 */
const BUYSELL_REGEX = /^([a-zA-Z0-9]{32,44}|0x[0-9a-fA-F]{40})\s*([+\-])\s*([0-9]+(?:\.[0-9]+)?)(%?)([a-zA-Z]*)$/;

/** Query — address only */
const QUERY_REGEX = /^([a-zA-Z0-9]{32,44}|0x[0-9a-fA-F]{40})$/;

/* -------------------------------------------------------------------------- */
/* Parser                                                                      */
/* -------------------------------------------------------------------------- */

export function parseTradeDown(line: string): TradeDownCmd | ParseError {
  const trimmed = line.trim();

  // 1️⃣ Buy / Sell
  const buySell = trimmed.match(BUYSELL_REGEX);
  if (buySell) {
    const [, address, op, valStr, pct, unitRaw] = buySell;

    if (!isValidAddress(address)) {
      return { code: 'INVALID_ADDRESS', message: `Invalid address: ${address}` };
    }

    const value = Number(valStr);
    if (!Number.isFinite(value)) {
      return { code: 'INVALID_VALUE', message: `Value “${valStr}” is not a valid number.` };
    }

    const isPercent = pct === '%';
    let unit = unitRaw.toLowerCase();
    if (!unit) unit = op === '+' ? 'bnb' : 'token';

    const action: Action = op === '+' ? 'buy' : 'sell';
    const chain = detectChain(address);

    return { mode: 'tradedown', action, target: address, value, isPercent, unit, chain };
  }

  // 2️⃣ Query
  const query = trimmed.match(QUERY_REGEX);
  if (query) {
    const [address] = query;
    if (!isValidAddress(address)) {
      return { code: 'INVALID_ADDRESS', message: `Invalid address: ${address}` };
    }
    const chain = detectChain(address);
    return { mode: 'tradedown', action: 'query', target: address, chain };
  }

  return { code: 'INVALID_FORMAT', message: 'Input does not match TradeDown syntax.' };
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function isValidAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr) || /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

function detectChain(addr: string): string {
  if (/^0x[0-9a-fA-F]{40}$/.test(addr)) return 'bsc';
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)) return 'sol';
  return 'unknown';
}

/* -------------------------------------------------------------------------- */
/* Example CLI                                                                 */
/* -------------------------------------------------------------------------- */

if (require.main === module) {
  const examples = [
    '0x098054c0c6ba84d95E2011946Db9a15BfFDB4444+0.5bnb',  // EVM buy
    '0x098054c0c6ba84d95E2011946Db9a15BfFDB4444-100%',    // EVM sell
    '0xAabbccddeeff00112233445566778899AabbCCDD',          // EVM query
    '9wFFo5AF2Zr1y9fQzSBkJtN49KBTzVZzraNmu6uUah8d+3sol',   // Solana buy
    '3n65MaYLVdu8Dfi63Zrm25KCNt4WyLPVWwNT5Ch9S93W',        // Solana query
  ];

  for (const line of examples) {
    console.log(`"${line}" ->`, parseTradeDown(line));
  }
}

/* -------------------------------------------------------------------------- */
/* Build / Run                                                                 */
/* -------------------------------------------------------------------------- */
// tsc TradeDown.ts && node TradeDown.js
