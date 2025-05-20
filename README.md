# TradeDown
Text-Based Crypto Trading Language

```
# TradeDown 语法介绍

## 基本格式
 

<address> [+|-] <value>[%] [unit]
```

## 各部分说明

* `<address>`：

  * EVM 地址，40位十六进制，前缀 `0x`（如 `0x0980...`）
  * Solana 地址，32\~44位 Base58 编码（如 `3n65MaYLVdu8Dfi63Zrm25KCNt4WyLPVWwNT5Ch9S93W`）

* `+` ：买入操作符，表示买入指定数量的代币。

* `-` ：卖出操作符，表示卖出指定数量或百分比的代币。

* `<value>`：

  * 数值，支持整数或小数（如 `0.5`、`100`）。
  * 代表买入/卖出的数量或百分比。

* `%`（可选）：

  * 表示 `<value>` 是百分比（如 `100%` 表示全部卖出）。

* `[unit]`（可选）：

  * 代币单位，如 `bnb`、`sol`、`token` 等。
  * 默认买入时单位为 `bnb`，卖出时单位为 `token`。

## 查询语法

仅填写 `<address>` 即可，表示查询该地址的代币信息。

## 示例

* `0x098054c0c6ba84d95E2011946Db9a15BfFDB4444+0.5bnb`
  买入 0.5 个 BNB 的代币。

* `0x098054c0c6ba84d95E2011946Db9a15BfFDB4444-100%`
  卖出该地址持有的全部代币。

* `3n65MaYLVdu8Dfi63Zrm25KCNt4WyLPVWwNT5Ch9S93W`
  查询 Solana 地址对应的代币信息。

