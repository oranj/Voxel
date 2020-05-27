import BinomialCoefficient from "./BinomialCoefficient";

export default class BezierFunction {
	/**
	 * Constructs a new Bezier calculator.
	 *
	 * @constructor
	 * @param {number[]} values       An array of numbers for the bezier function
	 * @param {BinomialCoefficient} coefficients A binomial coefficient generator
	 */
	constructor(
		private readonly values: number[],
		private readonly coefficients: BinomialCoefficient
	) { }


	/**
	 * Gets the value of the bezier function at a provided time.
	 *
	 * @param  {number} time A value between 0 and 1
	 * @return {number}      The value at the provided time
	 */
	getAt(time: number): number {

		let sum = 0;
		const n = this.values.length - 1;

		for (let i = 0; i <= n; i++) {
			const coefficient = this.coefficients.get(n, i);

			sum += coefficient * Math.pow(1 - time, (n - i)) * Math.pow(time, i) * this.values[i];
		}

		return sum;
	}
}
