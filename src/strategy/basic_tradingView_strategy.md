# Trading view strategy to buy and sell crypto at a specific intervals using various Indicators such as ema (exponential moving average)
    *   Following is pine script code.

// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
//@version=4
strategy(title="EMA throwaway", shorttitle="EMAThrow", format=format.price, precision=2, overlay = true, currency = currency.USD, initial_capital = 10000, default_qty_type = strategy.cash, default_qty_value = 10000, commission_type = strategy.commission.percent, commission_value= 0.1)
////////////////////

// Date setup
startDate = input(title="Start Date", type=input.integer, defval=1, minval=1, maxval=31)
startMonth = input(title="Start Month", type=input.integer, defval=1, minval=1, maxval=12)
startYear = input(title="Start Year", type=input.integer, defval=2023, minval=1800, maxval=2100)
afterStartDate = (time >= timestamp(syminfo.timezone, startYear, startMonth, startDate, 0, 0))
endDate = input(title="End Date", type=input.integer, defval=1, minval=1, maxval=31)
endMonth = input(title="End Month", type=input.integer, defval=7, minval=1, maxval=12)
endYear = input(title="End Year", type=input.integer, defval=2023, minval=1800, maxval=2100)
beforeEndDate = (time <= timestamp(syminfo.timezone, endYear, endMonth, endDate, 0, 0))


// EMA 200
ema9 = ema(close, 9)
ema21 = ema(close, 21)
ema55 = ema(close, 55)
// Rules
buyRule = crossover(ema9, ema21)  // when to buy
sellRule = crossunder(ema9, ema55) // // when to sell
// On graph plots
plot(ema9, color = color.red, linewidth = 2)
plot(ema21, color = color.orange)
plot(ema55, color = color.yellow)

// // Trade entry
if afterStartDate and beforeEndDate
    strategy.entry("EMAThrow", long=true, when=buyRule)

// // Trade exit
if afterStartDate and beforeEndDate
    strategy.close("EMAThrow", when=sellRule)