define(function() {

	/**
	 * Constructs a new Bezier calculator.
	 *
	 * @constructor
	 * @param {number[]} values       An array of numbers for the bezier function
	 * @param {BinomialCoefficient} coefficients A binomial coefficient generator
	 */
	var BezierFunction = function(values, coefficients) {
		this.values = values;
		this.coefficients = coefficients;
	};

	/**
	 * Gets the value of the bezier function at a provided time.
	 *
	 * @this {BezierFunction}
	 * @param  {number} time A value between 0 and 1
	 * @return {number}      The value at the provided time
	 */
	BezierFunction.prototype.getAt = function(time) {

		var i, coefficient, sum = 0, n = this.values.length - 1;

		for (var i = 0; i <= n; i++) {
			coefficient = this.coefficients.get(n, i);

			sum += coefficient * Math.pow(1 - time, (n - i)) * Math.pow(time, i) * this.values[i];
		}

		return sum;

	};


	return BezierFunction;
});