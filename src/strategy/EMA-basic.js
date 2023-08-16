const { getOHLCV, performTrade, backTestCheckCommon } = require('../utils/helper');
const ema = require('../indicators/ema');
const { crossOver, crossUnder } = require('../utils/cross');
const { detachSource } = require('../utils/source');

//need to calculate these three EMAs

// ema9 = ema(close, 9)
// ema21 = ema(close, 21)
// ema55 = ema(close, 55)

// this function will be called in a cron
const basic_EMA_Strategy = async (backtest = false, symbol = 'BTCUSDT', interval = '1h', previousOrders = []) => {
	const ohlcvData = await getOHLCV(symbol, interval);
	const source = detachSource(ohlcvData);

	const ema9 = ema(source['close'], '9');
	const ema21 = ema(source['close'], '21');
	const ema55 = ema(source['close'], '55');

	const dataForStrategy = {
		ema9,
		ema21,
		ema55
	};

	if (backtest) {
		// const backtestOHLCV = ohlcvData.map((el: any) => el.ohlc);

		const backTestRes = backTestCheckCommon(dataForStrategy, source['time'], symbol, ohlcvData, performTradeOrNot);
		return backTestRes;
	}

	const orderDecision = performTradeOrNot({
		...dataForStrategy,
		previousOrders
	});

	if (orderDecision) {
		console.log('MAKING TRADE -- ', orderDecision);
		// const tradeRes = await performTrade(symbol, orderDecision, 0.0000002);   //uncomment for placing real orders
		// console.log('tradeRes --', tradeRes);
	} else {
		console.log('HOLDING');
	}
	return orderDecision;
};

const performTradeOrNot = (data) => {
	const buy = crossOver(data.ema9, data.ema21); // when to buy
	const sell = crossUnder(data.ema9, data.ema55); // // when to sell

	if (buy && previousOrders.lastOrderType[-1] !== 'buy') {
		return 'buy';
	} else if (sell && previousOrders.lastOrderType[-1] !== 'sell' && previousOrders.lastOrderType[-1] == 'buy') {
		return 'sell';
	} else {
		return null; // hold
	}
};

module.exports = basic_EMA_Strategy;
