define(['vox/Shape/BaseShape'], function(BaseShape) {

	var Cone = function(w, d, h, th) {
		BaseShape.call(this, w, d, h, th);

		var minDimension = Math.min(this.width, this.depth, this.height * 2);

		this.minRadius = minDimension / 2;
		this.adjustedMinRadius = (minDimension - 1) / 2;
	};
	Cone.prototype = Object.create(BaseShape.prototype);
	Cone.prototype.generate3d = function(radius) {
		var out = [],
			zRadius = this.height - 0.5,
			realZRadius = this.height,

			zFactor = zRadius / this.adjustedMinRadius,

			adjustedZ,
			circleRadius,
			zHeight, z, percent;

		for (z = 0.5; z <= zRadius; z++) {

			adjustedZ = Math.abs(z / zFactor);
			zHeight = this.minRadius - adjustedZ;
			percent = 1 - (z / this.height);

			circleRadius = percent * this.minRadius;
			out.push(this.generateRotation(circleRadius));
		}
		return out;
	};

	return Cone;

});