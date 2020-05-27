import BaseShape from "./BaseShape";
import BezierFunction from "../General/BezierFunction";
import BinomialCoefficient from "../General/BinomialCoefficient";
import { Shape3D } from "./ShapeInterface";

export default class Bezier extends BaseShape {

	private readonly bezierFunctionX: BezierFunction;
	private readonly bezierFunctionY: BezierFunction;
	private readonly minRadius: number;


	/**
	 * Constructs a shape that can generate a shape from bezier control points
	 *
	 * @constructor
	 * @param {number} width     The width of the shape
	 * @param {number} depth     The depth of the shape
	 * @param {number} height    The height of the shape
	 * @param {number|undefined} thickness The thickness of the shape, or undefined if solid
	 * @param {number[]} pointsX   An array of control point x values
	 * @param {number[]} pointsY   An array of control point y values
	 * @param {string} axis      The string around which to rotate.
	 *
	 * @todo  respect axis changes
	 */
	constructor(
		width: number,
		depth: number,
		height: number,
		thickness: number|undefined,
		pointsX: number[],
		private readonly pointsY: number[],
		private readonly axis: "x"|"y"|"z"
	) {
		super(width, depth, height, thickness);

		const minDimension = Math.min(this.width, this.depth, this.height);
		const coefficient = new BinomialCoefficient();

		this.bezierFunctionX = new BezierFunction(pointsX, coefficient);
		this.bezierFunctionY = new BezierFunction(pointsY, coefficient);

		this.minRadius = minDimension / 2;
	}

	/**
	 * Gets a point along the bezier's curve
	 *
	 * @this {Bezier}
	 * @param  {number} time A time according to the bezier control points
	 * @return {object}      An x/y pair of point values
	 */
	getPoint(time: number): { x: number, y: number} {
		return {
			x: this.bezierFunctionX.getAt(time),
			y: this.bezierFunctionY.getAt(time)
		};
	}

	/**
	 * Generates a 3d matrix of booleans indicating if the cell is occupied
	 * @return {Boolean[][][]} A matrix of if the cell is occupied
	 */
	generate3d(): Shape3D {
		let granularity: number = 1;
		const out: Shape3D = [];

		if (this.axis == "x") {
			granularity = this.width;
		} else if (this.axis == "y") {
			granularity = this.depth;
		} else if (this.axis == "z") {
			granularity = this.height;
		}

		const samples: { [point: string]: number} = { };
		for (let i = 0; i < (10 * granularity); i++) {

			const time = i / (10 * granularity);
			const p = this.getPoint(time);
			const px = Math.floor(p.x * granularity);

			if (! samples.hasOwnProperty(px)) {
				samples[px] = p.y;
			} else {
				samples[px] = Math.max(p.y, samples[px]);
			}
		}

		samples[0] = this.pointsY[0];

		for (let i = 0; i < this.height; i++) {
			const radius = samples[i] * this.minRadius;
			out.push(this.generateRotation(radius));
		}

		return out;

	}
}
