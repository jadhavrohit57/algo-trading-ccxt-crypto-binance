const cron = require('node-cron');
const { EVERY_HOUR, EVERY_MINUTE, EVERY_5_SECONDS } = require('./utils/cron-expressions');

const { emaBasic } = require('./strategy');

//RUN live strategy algorithm bot

const previousOrders = [];
cron
	.schedule(EVERY_5_SECONDS, async () => {
		console.time('emaBasic');
		const orderSatus = await emaBasic('BTCUSDT', '1h', previousOrders);
		if (orderSatus) {
			orderSatus.push(orderSatus);
		}
		console.timeEnd('emaBasic');
	})
	.stop(); //remove this to start running cron

//Back Testing strategy

const backTest = async () => {
	const backtestResult = await emaBasic(true, 'BTCUSDT', '1h');
	console.log('backtestResult -- ', backtestResult);
};

// backTest(); // uncomment this to run backtest
