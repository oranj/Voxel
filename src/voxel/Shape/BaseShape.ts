import { ShapeInterface, Shape2D, Shape3D } from "./ShapeInterface";

export default abstract class BaseShape implements ShapeInterface{
	/**
	 * Constructor for the BaseShape
	 *
	 * @constructor
	 * @param {number} width     The width of the shape
	 * @param {number} depth     The depth of the shape
	 * @param {number} height    The height of the shape
	 * @param {number|undefined} thickness The thickness of the shape, undefined if solid
	 */
	constructor(
		public readonly width: number,
		public readonly depth: number,
		public readonly height: number,
		public readonly thickness?: number
	) { }

	abstract generate3d(): Shape3D;

	checkDistance(distance: number, radius: number): boolean {
		if (this.thickness) {
			return (radius - this.thickness <= distance && distance <= radius);
		}
		return distance < radius;
	}

	/**
	 * Given a radius, generates a 2d matrix of booleans
	 */
	generateRotation(radius: number): Shape2D {
		const plane: Shape2D = [];
		const xRadius = (this.width - 1) / 2;
		const yRadius = (this.depth - 1) / 2;
		const minRadius = Math.min(xRadius, yRadius);

		const xRatio = xRadius / minRadius;
		const yRatio = yRadius / minRadius;

		for (let y = -yRadius; y <= yRadius; y++) {
			const row: boolean[] = [];
			for (let x = -xRadius; x <= xRadius; x++) {
				const distance = Math.sqrt(
					Math.pow(x / xRatio, 2) +
					Math.pow(y / yRatio, 2)
				);

				row.push(this.checkDistance(distance, radius));
			}
			plane.push(row);
		}
		return plane;
	}
}
