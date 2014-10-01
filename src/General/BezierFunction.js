define(function() {

	var BezierFunction = function(values, coefficients) {

		this.values = values;
		this.coefficients = coefficients;

	};

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