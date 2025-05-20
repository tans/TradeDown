# TradeDown Syntax Parser — Usage Guide

## Overview

`TradeDown.ts` provides a lightweight, human-friendly syntax for parsing common blockchain trading actions like **buy**, **sell**, and **query**, all in one line of text.

## Features

* 🔍 Simple one-line trade expressions
* ⚡ Auto-detects EVM or Solana addresses
* 🌐 Multi-chain support with default to `bsc`
* 🧠 Intuitive operators: `+` for buy, `-` for sell
* 📝 Optional units (`bnb`, `eth`, `sol`, or `%`)

---

## Supported Formats

### 1. Buy Command

```txt
0x... + 0.5bnb
```

**Effect:** Buy 0.5 BNB worth of the token at `0x...` on BSC (or inferred chain).

### 2. Sell Command

```txt
0x... - 100%
```

**Effect:** Sell 100% of the token held at `0x...`.

### 3. Query Command

```txt
0x...
```

**Effect:** Query the token information at this address.

### 4. Solana Format

```txt
3n65... + 1.2sol
```

**Effect:** Buy 1.2 SOL worth of this SPL token on Solana.

---

## Syntax Reference

```
<address> [+|-] <value>[%] [unit]
```

* `<address>`: EVM (0x...) or Solana (base58)
* `+`: Buy command
* `-`: Sell command
* `%`: Optional. Interprets `value` as a percentage.
* `[unit]`: Optional. Default is:

  * `bnb` for buy
  * `token` for sell

---

## Examples

| Input            | Output Description          |
| ---------------- | --------------------------- |
| `0xABC...+1bnb`  | Buy 1 BNB worth of token    |
| `0xABC...-50%`   | Sell 50% of token holdings  |
| `0xABC...`       | Query token info            |
| `9wFF...+2.3sol` | Buy 2.3 SOL worth on Solana |

---

## Error Codes

| Code              | Description                   |
| ----------------- | ----------------------------- |
| `INVALID_FORMAT`  | Does not match syntax pattern |
| `INVALID_ADDRESS` | Address not EVM/Solana valid  |
| `INVALID_VALUE`   | Value is not a valid number   |

---

## Run Instructions

```bash
# Compile
$ tsc TradeDown.ts

# Run Example
$ node TradeDown.js
```

---

## Customization

Extend `detectChain()` to support additional blockchains such as Ethereum (`eth`), Polygon (`matic`), etc.
