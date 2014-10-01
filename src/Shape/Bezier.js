define(['vox/Shape/BaseShape', 'vox/General/BezierFunction', 'vox/General/BinomialCoefficient'], function(BaseShape, BezierFunction, BinomialCoefficient) {



	var Bezier = function(w, d, h, thickness, pointsX, pointsY, axis) {

		BaseShape.call(this, w, d, h, thickness);


		var minDimension = Math.min(this.width, this.depth, this.height),
			coefficient = new BinomialCoefficient();
		this.pointsX = pointsX;
		this.pointsY = pointsY;

		this.axis = axis;

		this.bezierFunctionX = new BezierFunction(
			pointsX, coefficient
		);
		this.bezierFunctionY = new BezierFunction(
			pointsY, coefficient
		);


		this.minRadius = minDimension / 2;
		this.adjustedMinRadius = (minDimension - 1) / 2;

	};


	Bezier.prototype = Object.create(BaseShape.prototype);
	Bezier.prototype.getPoint = function(time) {
		return {
			x: this.bezierFunctionX.getAt(time),
			y: this.bezierFunctionY.getAt(time)
		};
	};
	Bezier.prototype.generate3d = function() {

		var granularity = 1;
		if (this.axis == 'x') {
			granularity = this.width;
		} else if (this.axis == 'y') {
			granularity = this.depth;
		} else if (this.axis == 'z') {
			granularity = this.height;
		}

		var samples = {};
		for (var i = 0; i < (10 * granularity); i++) {

			var time = i / (10 * granularity),
				p = this.getPoint(time),
				px = Math.floor(p.x * granularity);

			if (! samples.hasOwnProperty(px)) {
				samples[px] = p.y;
			} else {
				samples[px] = Math.max(p.y, samples[px]);
			}
		}

		samples[0] = this.pointsY[0];

		var out = [];
		for (var i = 0; i < this.height; i++) {
			var radius = samples[i] * this.minRadius;

			out.push(this.generateRotation(radius));
		}

		return out;

	}


	return Bezier;
});