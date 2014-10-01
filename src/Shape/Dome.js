define(['vox/Shape/BaseShape'], function(BaseShape) {

	var Dome = function(w, d, h, th) {
		BaseShape.call(this, w, d, h, th);

		var minDimension = Math.min(this.width, this.depth, this.height * 2);

		this.minRadius = minDimension / 2;
		this.adjustedMinRadius = (minDimension - 1) / 2;
	};
	Dome.prototype = Object.create(BaseShape.prototype);
	Dome.prototype.generate3d = function(radius) {
		var out = [],
			zRadius = this.height - 0.5,
			realZRadius = this.height,

			zFactor = zRadius / this.adjustedMinRadius,

			adjustedZ,
			circleRadius,
			zHeight, z;

		for (z = 0.5; z <= zRadius; z++) {

			adjustedZ = Math.abs(z / zFactor);
			zHeight = this.minRadius - adjustedZ;
			circleRadius = Math.sqrt(zHeight * (2 * this.adjustedMinRadius - zHeight));

			out.push(this.generateRotation(circleRadius));
		}
		return out;
	};

	return Dome;

});