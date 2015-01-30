define(function() {
	"use strict";

	/**
	 * Constructor for the BaseShape
	 *
	 * @constructor
	 * @param {number} width     The width of the shape
	 * @param {number} depth     The depth of the shape
	 * @param {number} height    The height of the shape
	 * @param {number|undefined} thickness The thickness of the shape, undefined if solid
	 */
	var BaseShape = function(width, depth, height, thickness) {
		this.width = parseInt(width, 10);
		this.depth = parseInt(depth, 10);
		this.height = parseInt(height, 10);
		this.thickness = thickness;
	};

	BaseShape.prototype = {
		/**
		 * Checks a distance against a radius to determind if the distance is considered filled or not.
		 *
		 * @param  {number} distance The distance from the shape to the center.
		 * @param  {number} radius   The shape's radius at the current level
		 * @return {Boolean}         Whether or not the block should be filled.
		 */
		checkDistance: function(distance, radius) {
			if (this.thickness) {
				return (radius - this.thickness <= distance && distance <= radius );
			}
			return distance < radius;
		},
		/**
		 * Generates a 3d shape. This should be extended.
		 *
		 * @throws Error
		 */
		generate3d: function() {
			throw new Error("Unimplemented method `generate3d`");
		},

		/**
		 * Given a radius, generates a 2d matrix of booleans
		 *
		 * @this {BaseShape}
		 * @param  {number} radius The radius of the shape at that level
		 * @return {Boolean[][]}   A 2d matrix of filled cells
		 */
		generateRotation: function(radius) {
			var plane = [], row,

				xRadius = (this.width - 1) / 2,
				yRadius = (this.depth - 1) / 2,

				minRadius = Math.min(xRadius, yRadius),

				xRatio = xRadius / minRadius,
				yRatio = yRadius / minRadius,

				xP, yP, distance, y, x;

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