import BaseShape from "./BaseShape";
import { Shape3D } from "./ShapeInterface";

export default class Cone extends BaseShape {
	private minRadius: number;

	/**
	 * Constructs a Cone object
	 *
	 * @constructor
	 * @param {number} width         The width of the shape
	 * @param {number} depth         The depth of the shape
	 * @param {number} height         The height of the shape
	 * @param {number|null} thickness The thickness of the shape, or undefined if hollow
	 */
	constructor(
		width: number,
		depth: number,
		height: number,
		thickness?: number
	) {
		super(width, depth, height, thickness);
		const minDimension = Math.min(width, depth);
		this.minRadius = minDimension / 2;
	}

	/**
	 * Generates a 3d matrix of booleans indicating if the cell is occupied
	 *
	 * @this {Cone}
	 * @return {Boolean[][][]}
	 */
	generate3d(): Shape3D {
		const out: Shape3D = [];
		const zRadius = this.height - 0.5;

		for (let z = 0.5; z <= zRadius; z++) {
			const percent = 1 - (z / this.height);
			const circleRadius = percent * this.minRadius;
			out.push(this.generateRotation(circleRadius));
		}
		return out;
	}
}
