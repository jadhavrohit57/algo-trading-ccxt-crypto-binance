const ccxt = require('ccxt');
const moment = require('moment');

const exchange = new ccxt['binance']({
	apiKey: '',
	secret: ''
});

// exchange.set_sandbox_mode(true); // comment if you're not using the testnet

const getOHLCV = async (ticker = 'BTCUSDT', interval = '1h', limit = 200, since = undefined) => {
	try {
		const ohlcvRes = await exchange.fetchOHLCV(ticker, interval, since, limit);
		//pop last element from array as its a current ticker value not a current interval completed value
		ohlcvRes.pop();
		return ohlcvRes;
	} catch (err) {
		console.log('error -- ', err);
		throw err;
	}
};

// getOHLCV('BTCUSDT', '1h');

const getTicker = async (ticker) => {
	try {
		const tickerInfo = await exchange.fetchTicker(ticker);

		const tickerData = {
			timeStamp: tickerInfo.timestamp,
			open: tickerInfo.open,
			high: tickerInfo.high,
			low: tickerInfo.low,
			close: tickerInfo.close, // close will be the latest price
			volume: tickerInfo.bidVolume
		};
		return tickerData;
	} catch (err) {
		logger.error(err, { from: 'getTicker' });
		throw err;
	}
};
// getTicker('BTC/USDT')

const getBalance = async () => {
	const balRes = await exchange.fetchBalance();
	return balRes;
};

// getBalance();

const performTrade = async (coin = 'BTCUSDT', side = 'buy', quantity) => {
	try {
		const orderRes = await exchange.createOrder(coin, 'market', side, quantity);
		return orderRes;
	} catch (error) {
		throw error;
	}
};

const backTestCheckCommon = (
	strategyResponse,
	dateTimeList,
	tickerSymbol,
	backtestOHLCV,
	backtestPerformTradeOrNot
) => {
	try {
		//every array should have same length.. so slice it to the minimum length
		const allLengths = [];
		const arrayTypeValueKeys = [];
		const nonArrayObject = {};
		Object.entries(strategyResponse).forEach((entry) => {
			if (Array.isArray(entry[1])) {
				arrayTypeValueKeys.push(entry[0]);
				allLengths.push(entry[1].length);
			} else {
				nonArrayObject[entry[0]] = entry[1];
			}
		});

		const lowestLength = Math.min(...allLengths);

		Object.keys(strategyResponse).forEach((d) => {
			if (Array.isArray(strategyResponse[d])) {
				strategyResponse[d] = strategyResponse[d].slice(
					strategyResponse[d].length - lowestLength,
					strategyResponse[d].length
				);
			}
		});

		dateTimeList = dateTimeList.slice(dateTimeList.length - lowestLength, dateTimeList.length);

		let cumProfit = 0;
		let previousBuyPrice = 0;
		let totalSignals = 0;
		const allTrades = [];

		let previousSignal = 'sell';
		for (let index = 1; index < lowestLength; index++) {
			//   //slice data

			const conditionsCheckPayload = { ...nonArrayObject };

			arrayTypeValueKeys.forEach((element) => {
				conditionsCheckPayload[element] = strategyResponse[element].slice(index - 1, index + 1);
			});

			const currentSignal = backtestPerformTradeOrNot(conditionsCheckPayload);

			const tradetTime = moment(dateTimeList[index]).add(1, 'h');
			if (currentSignal) {
				if (previousSignal !== currentSignal) {
					previousSignal = currentSignal;

					const openPrice = backtestOHLCV.find((e) => e[0] === parseInt(tradetTime.valueOf()))[1];

					totalSignals += 1;
					const tradeRes = {
						index: totalSignals,
						symbol: tickerSymbol,
						signal: currentSignal,
						trade_time: tradetTime.toISOString(),
						price: openPrice
					};

					if (currentSignal === 'sell') {
						// // const profit = openPrice - previousBuyPrice;
						// const profit = roundTo(openPrice - previousBuyPrice, 8);
						// cumProfit = roundTo(cumProfit + profit, 8);
						// // cumProfit = cumProfit + profit;
						// tradeRes['profit'] = profit;
						// tradeRes['cumProfit'] = cumProfit;
					} else {
						previousBuyPrice = openPrice;
					}
					allTrades.push(tradeRes);
				} else {
					console.log('skipping');
				}
			}
		}

		return { allTrades, cumProfit };
	} catch (error) {
		console.log('error', error);
	}
};

module.exports = {
	getOHLCV,
	getTicker,
	getBalance,
	performTrade,
	backTestCheckCommon
};
