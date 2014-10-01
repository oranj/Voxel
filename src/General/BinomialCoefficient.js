define(function() {
	var cache = {},
		/**
		 * A function for determining binomial coefficients. Memoized for speed
		 *
		 * @constructor
		 */
		BinomialCoefficient = function() {};

	/**
	 * Gets the binomial coefficient using the recursive formula
	 *
	 * @see http://en.wikipedia.org/wiki/Binomial_coefficient
	 *
	 * @param  {number} n The number of coefficients
	 * @param  {number} k The index of the coefficient
	 * @return {number}   The binomial coefficient
	 */
	BinomialCoefficient.prototype.get = function(n, k) {
		var val;
		if (! cache.hasOwnProperty(n)) {
			cache[n] = {};
		}
		if (! cache[n].hasOwnProperty(k)) {
			if (k == 0 || n == k) {
				val = 1;
			} else {
				val = this.get(n - 1, k - 1) + this.get(n - 1, k);
			}
			cache[n][k] = val;
		}
		return cache[n][k];
	};

	return BinomialCoefficient;

});