define(function() {

	var BaseShape = function(width, depth, height, thickness) {
		this.width = parseInt(width, 10);
		this.depth = parseInt(depth, 10);
		this.height = parseInt(height, 10);
		this.thickness = thickness;
	};

	BaseShape.prototype = {
		checkDistance: function(distance, radius) {
			if (this.thickness) {
				return (radius - this.thickness <= distance && distance <= radius );
			}
			return distance < radius;
		},
		generate3d: function() {
			throw new Error("Unimplemented method `generate3d`");
		},
		generateRotation: function(radius) {
			var plane = [], row,

				xRadius = (this.width - 1) / 2,
				yRadius = (this.depth - 1) / 2,

				minRadius = Math.min(xRadius, yRadius),

				xRatio = xRadius / minRadius,
				yRatio = yRadius / minRadius,

				xP, yP, distance

			for (y = -yRadius; y <= yRadius; y++) {
				row = [];
				for (x = -xRadius; x <= xRadius; x++) {

					xP = x / xRatio;
					yP = y / yRatio;

					distance = Math.sqrt(Math.pow(xP, 2) + Math.pow(yP, 2));
					row.push(this.checkDistance(distance, radius));

				}
				plane.push(row);
			}
			return plane;
		}
	};

	return BaseShape;

});