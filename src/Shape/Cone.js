define(['vox/Shape/BaseShape'], function(BaseShape) {
	"use strict";

	/**
	 * Constructs a Cone object
	 *
	 * @constructor
	 * @param {number} width         The width of the shape
	 * @param {number} depth         The depth of the shape
	 * @param {number} height         The height of the shape
	 * @param {number|null} thickness The thickness of the shape, or undefined if hollow
	 */
	var Cone = function(width, depth, height, thickness) {
		BaseShape.call(this, width, depth, height, thickness);

		var minDimension = Math.min(this.width, this.depth);

		this.minRadius = minDimension / 2;
		this.adjustedMinRadius = (minDimension - 1) / 2;
	};
	Cone.prototype = Object.create(BaseShape.prototype);
	/**
	 * Generates a 3d matrix of booleans indicating if the cell is occupied
	 *
	 * @this {Cone}
	 * @return {Boolean[][][]}
	 */
	Cone.prototype.generate3d = function(radius) {
		var out = [],
			zRadius = this.height - 0.5,

			circleRadius,
			z, percent;

		for (z = 0.5; z <= zRadius; z++) {

			percent = 1 - (z / this.height);

			circleRadius = percent * this.minRadius;
			out.push(this.generateRotation(circleRadius));
		}
		return out;
	};

	return Cone;

});