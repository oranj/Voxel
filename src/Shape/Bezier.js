define(['vox/Shape/BaseShape', 'vox/General/BezierFunction', 'vox/General/BinomialCoefficient'], function(BaseShape, BezierFunction, BinomialCoefficient) {

	"use strict";

	/**
	 * Constructs a shape that can generate a shape from bezier control points
	 *
	 * @constructor
	 * @param {number} width     The width of the shape
	 * @param {number} depth     The depth of the shape
	 * @param {number} height    The height of the shape
	 * @param {number|undefined} thickness The thickness of the shape, or undefined if solid
	 * @param {number[]} pointsX   An array of control point x values
	 * @param {number[]} pointsY   An array of control point y values
	 * @param {string} axis      The string around which to rotate.
	 *
	 * @todo  respect axis changes
	 */
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
	/**
	 * Gets a point along the bezier's curve
	 *
	 * @this {Bezier}
	 * @param  {number} time A time according to the bezier control points
	 * @return {object}      An x/y pair of point values
	 */
	Bezier.prototype.getPoint = function(time) {
		return {
			x: this.bezierFunctionX.getAt(time),
			y: this.bezierFunctionY.getAt(time)
		};
	};

	/**
	 * Generates a 3d matrix of booleans indicating if the cell is occupied
	 * @return {Boolean[][][]} A matrix of if the cell is occupied
	 */
	Bezier.prototype.generate3d = function() {

		var granularity = 1,
			samples = {},
			out = [],
			radius,
			i, time, p, px;

		if (this.axis == 'x') {
			granularity = this.width;
		} else if (this.axis == 'y') {
			granularity = this.depth;
		} else if (this.axis == 'z') {
			granularity = this.height;
		}

		samples = {};
		for (i = 0; i < (10 * granularity); i++) {

			time = i / (10 * granularity);
			p = this.getPoint(time);
			px = Math.floor(p.x * granularity);

			if (! samples.hasOwnProperty(px)) {
				samples[px] = p.y;
			} else {
				samples[px] = Math.max(p.y, samples[px]);
			}
		}

		samples[0] = this.pointsY[0];

		for (i = 0; i < this.height; i++) {
			radius = samples[i] * this.minRadius;

			out.push(this.generateRotation(radius));
		}

		return out;

	};

	return Bezier;
});