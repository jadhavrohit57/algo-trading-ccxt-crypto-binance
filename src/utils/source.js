const oIndex = 1,
	hIndex = 2,
	lIndex = 3,
	cIndex = 4,
	vIndex = 5,
	timeIndex = 0;

const detachSource = (ohlcv) => {
	const source = {};
	source['time'] = [];
	source['open'] = [];
	source['high'] = [];
	source['low'] = [];
	source['close'] = [];
	source['volume'] = [];
	if (ohlcv.length == 0) {
		return source;
	}
	ohlcv.forEach((data) => {
		source['time'].push(data[timeIndex]);
		source['open'].push(data[oIndex]);
		source['high'].push(data[hIndex]);
		source['low'].push(data[lIndex]);
		source['close'].push(data[cIndex]);
		source['volume'].push(data[vIndex]);
	});
	return source;
};

module.exports = { detachSource };
