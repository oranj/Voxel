define(['vox/Shape/BaseShape'], function(BaseShape) {

	/**
	 * Constructs a Sphere object
	 *
	 * @constructor
	 * @param {number} width         The width of the shape
	 * @param {number} depth         The depth of the shape
	 * @param {number} height         The height of the shape
	 * @param {number|null} thickness The thickness of the shape, or undefined if hollow
	 */
	var Sphere = function(width, depth, height, thickness) {
		BaseShape.call(this, width, depth, height, thickness);

		var minDimension = Math.min(this.width, this.depth, this.height);

		this.minRadius = minDimension / 2;
		this.adjustedMinRadius = (minDimension - 1) / 2;

	};

	Sphere.prototype = Object.create(BaseShape.prototype);

	/**
	 * Generates a 3d matrix of booleans indicating if the cell is occupied
	 *
	 * @this {Sphere}
	 * @return {Boolean[][][]}
	 */
	Sphere.prototype.generate3d = function() {
		var out = [],
			zRadius = (this.height - 1) / 2,
			realZRadius = this.height / 2,
			zFactor = zRadius / this.adjustedMinRadius,

			adjustedZ,
			circleRadius,
			zHeight, z;

		for (z = -zRadius; z <= zRadius; z++) {
			adjustedZ = Math.abs(z / zFactor);
			zHeight = realZRadius - adjustedZ;
			circleRadius = Math.sqrt(zHeight * (2 * this.minRadius - zHeight));

			out.push(this.generateRotation(circleRadius));
		}
		return out;
	};

	return Sphere;

});