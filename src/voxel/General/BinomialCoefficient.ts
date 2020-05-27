/**
 * A function for determining binomial coefficients. Memoized for speed
 *
 * @constructor
 */
export default class BinomialCoefficient {
	private cache: { [key: string]: { [key: string]: number}} = { };
	/**
	 * Gets the binomial coefficient using the recursive formula
	 *
	 * @see http://en.wikipedia.org/wiki/Binomial_coefficient
	 *
	 * @param  {number} n The number of coefficients
	 * @param  {number} k The index of the coefficient
	 * @return {number}   The binomial coefficient
	 */
	get(n: number, k: number): number {
		if (!this.cache.hasOwnProperty(n)) {
			this.cache[n] = { };
		}
		if (!this.cache[n].hasOwnProperty(k)) {
			if (k === 0 || n == k) {
				this.cache[n][k] = 1;
			} else {
				this.cache[n][k] = this.get(n - 1, k - 1) + this.get(n - 1, k);
			}
		}
		return this.cache[n][k];
	}
}
