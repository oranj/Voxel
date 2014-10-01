define(['vox/Shape/BaseShape'], function(BaseShape) {

	var Sphere = function(w, d, h, thickness) {
		BaseShape.call(this, w, d, h, thickness);

		var minDimension = Math.min(this.width, this.depth, this.height);

		this.minRadius = minDimension / 2;
		this.adjustedMinRadius = (minDimension - 1) / 2;

	};

	Sphere.prototype = Object.create(BaseShape.prototype);

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