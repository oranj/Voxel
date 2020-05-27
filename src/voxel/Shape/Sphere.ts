import BaseShape from "./BaseShape";
import { Shape3D } from "./ShapeInterface";

export default class Sphere extends BaseShape {

	private adjustedMinRadius: number;
	/**
	 * Constructs a Sphere object
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

		const minDimension = Math.min(this.width, this.depth);

		this.adjustedMinRadius = (minDimension - 1) / 2;
	}


	/**
	 * Generates a 3d matrix of booleans indicating if the cell is occupied
	 */
	generate3d(): Shape3D {
		const out: Shape3D = [];
		const zRadius = (this.height - 1) / 2;
		const zFactor = zRadius / this.adjustedMinRadius;

		for (let z = -zRadius; z <= zRadius; z++) {
			const adjustedZ = Math.abs(z / zFactor);
			const circleRadius = Math.sqrt(
				Math.pow(this.adjustedMinRadius + 0.5, 2) - Math.pow(Math.abs(adjustedZ), 2));

			out.push(this.generateRotation(circleRadius));
		}
		return out;
	}
}
