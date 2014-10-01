define(function() {
	var cache = {},
		BinomialCoefficient = function() {};

	BinomialCoefficient.prototype = {

		get: function(n, k) {
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
		}
	};

	return BinomialCoefficient;

});