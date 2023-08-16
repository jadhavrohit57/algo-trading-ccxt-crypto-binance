const { EMA } = require('technicalindicators');
const ema = (source, emaLength) => {
	try {
		const emaInput = {
			values: source,
			period: emaLength
		};
		return EMA.calculate(emaInput);
	} catch (err) {
		throw err;
	}
};

module.exports = ema;
