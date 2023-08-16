// val1, val2 is array data, demonstrating an indicator line
// this function verifies if val1 crossover val2
const crossOver = (val1, val2) => {
	//check if val2 is number
	if (typeof val2 === 'number') {
		return val1[val1.length - 2] < val2 && val1[val1.length - 1] >= val2;
	}
	return val1[val1.length - 2] < val2[val2.length - 2] && val1[val1.length - 1] >= val2[val2.length - 1];
};

// val1, val2 is array data, demonstrating an indicator line
// this function verifies if val1 crossunnder val2

const crossUnder = (val1, val2) => {
	if (typeof val2 === 'number') {
		return val1[val1.length - 2] > val2 && val1[val1.length - 1] <= val2;
	}
	return val1[val1.length - 2] > val2[val2.length - 2] && val1[val1.length - 1] <= val2[val2.length - 1];
};

module.exports = {
	crossOver,
	crossUnder
};
