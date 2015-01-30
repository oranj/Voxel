define(function() {

	"use strict";

	var SIN_THIRTY = Math.sin(Math.PI / 6),
		COS_THIRTY = Math.cos(Math.PI / 6),

		/**
		 * Converts a hex string into an rgba transparent string
		 *
		 * @param {string} rgbHex the hex color to transparentize
		 * @param {number} a The alpha value
		 * @return {string} The transparent string
		 */
		transparentize = function(rgbHex, a) {

			var m = rgbHex.substring(1).match('([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})'),
				r = parseInt(m[1], 16),
				g = parseInt(m[2], 16),
				b = parseInt(m[3], 16);

			return 'rgba('+r+','+g+','+b+','+a+')';
		},

	/**
	 * Creates an instance of a CanvasRenderer.
	 *
	 * @constructor
	 * @this {CanvasRenderer}
	 * @param {DOMElement} canvas The canvas element to render to
	 * @param {number} hypotenuseLength The length of the hypotenuse for drawing diamonds
	 * @param {string} leftColor The hex color of the left diamond
	 * @param {string} topColor The hex color of the top diamond
	 * @param {string} rightColor The hex color of the right diamond
	 */
	CanvasRenderer = function(canvas, hypotenuseLength, leftColor, topColor, rightColor) {

		this.canvas = canvas;

		this.colors = {
			left: leftColor,
			top: topColor,
			right: rightColor
		};

		this.transparentColors = {
			left: transparentize(leftColor, 0.2),
			top: transparentize(topColor, 0.2),
			right: transparentize(rightColor, 0.2)
		};

		this.updateRenderingData(hypotenuseLength);

	};
	CanvasRenderer.prototype = {
		/**
		 * Sets the desired hypotenuse length for each rendered diamond.
		 *
		 * @this {CanvasRenderer}
		 * @param {string} hypotenuseLength
		 */
		updateRenderingData: function(hypotenuseLength) {
			this.hypotenuseLength = hypotenuseLength;
			this.shortLength      = hypotenuseLength * SIN_THIRTY;
			this.longLength       = hypotenuseLength * COS_THIRTY;

			this.offsets = [
				{ x: 0,                   y: 0                     },
				{ x: this.longLength,     y: this.shortLength      },
				{ x: 2 * this.longLength, y: 0                     },
				{ x: 2 * this.longLength, y: -2 * this.shortLength },
				{ x: this.longLength,     y: -1 * this.shortLength },
				{ x: 0,                   y: -2 * this.shortLength },
				{ x: this.longLength,     y: -3 * this.shortLength }
			];


			this.hexCanvas = document.createElement('canvas');
			this.hexCanvas.setAttribute('width', Math.ceil(2 * this.longLength));
			this.hexCanvas.setAttribute('height', Math.ceil(2 * this.longLength) + 3);

			var ctx = this.hexCanvas.getContext('2d');
			this.drawCube(ctx, 0,  this.shortLength + this.longLength + 2, false);
		},

		/**
		 * Given voxel indices, projects them into 2 dimensional space
		 *
		 * @this {CanvasRenderer}
		 * @param {number} x the x index
		 * @param {number} y the y index
		 * @param {number} z the z index
		 * @param {origin} the point at which <0,0> should be rendered.
		 */
		project: function(x, y, z, origin) {
			x = parseInt(x, 10);
			y = parseInt(y, 10);
			z = parseInt(z, 10);

			return {
				x: origin.x + (this.longLength * (x + y)),
				y: origin.y + (this.shortLength * (y - x)) + (this.hypotenuseLength * -1 * z)
			};
		},

		/**
		 * Renders a cube into the provided context
		 *
		 * @this {CanvasRenderer}
		 * @param {CanvasRenderingContext2D} context The context in which to render
		 * @param {number} x The x position of the cube
		 * @param {number} y The y position of the cube
		 * @param {Boolean} transparent Whether or not to draw the cube transparently
		 */
		drawCube: function(context, x, y, transparent) {
			var colors = transparent ? this.transparentColors : this.colors;

			this.drawDiamond(
				context, x, y,
				this.offsets[0],
				this.offsets[1],
				this.offsets[4],
				this.offsets[5],
				colors.left
			);

			this.drawDiamond(
				context, x, y,
				this.offsets[1],
				this.offsets[2],
				this.offsets[3],
				this.offsets[4],
				colors.right
			);

			this.drawDiamond(
				context, x, y,
				this.offsets[3],
				this.offsets[4],
				this.offsets[5],
				this.offsets[6],
				colors.top
			);

		},

		/**
		 * Draws the prerendered cube onto the canvas
		 *
		 * @this {CanvasRenderer}
		 * @param {CanvasRenderingContext2D} context The context in which to render
		 * @param {number} x The x position of the cube
		 * @param {number} y The y position of the cube
		 * @param {Boolean} transparent Whether or not to draw the cube transparently
		 */
		drawCubePrerendered: function(context, x, y, transparent) {
			context.drawImage(this.hexCanvas, Math.round(x), Math.round(y) - 18);
		},

		/**
		 * Draws a diamond into the provided context
		 *
		 * @param  {CanvasRenderingContext2D} context The context in which to render
		 * @param  {number} x       The x position of the diamond
		 * @param  {number} y       The y position of the diamond
		 * @param  {number} offset1 The first point offset from the position
		 * @param  {number} offset2 The second point offset from the position
		 * @param  {number} offset3 The third point offset from the position
		 * @param  {number} offset4 The fourth point offset from the position
		 * @param  {string} color   The color to render
		 */
		drawDiamond: function(context, x, y, offset1, offset2, offset3, offset4, color) {

			context.fillStyle = color;

			context.beginPath();

			context.moveTo(x + offset1.x, y + offset1.y);
			context.lineTo(x + offset2.x, y + offset2.y);
			context.lineTo(x + offset3.x, y + offset3.y);
			context.lineTo(x + offset4.x, y + offset4.y);
			context.closePath();

			context.fill();
		},

		/**
		 * Given the size of a result matrix, gets size information
		 *
		 * @param  {number} width The width of the result matrix
		 * @param  {number} depth The depth of the result matrix
		 * @param  {number} height The height of the result matrix
		 * @return {mixed}        The width and height of the canvas, as well as the center.
		 */
		getCanvasSize:  function(width, depth, height) {

			var canvasWidth = (width + depth) * this.longLength,
				canvasHeight = (height * this.hypotenuseLength) + ((width + depth) * this.shortLength);

			return {
				width: canvasWidth,
				height: canvasHeight,
				origin: {
					x: 0,
					y: height - (depth * this.shortLength)
				}
			};
		},

		/**
		 * Clears the canvas
		 *
		 * @this {CanvasRenderer}
		 * @todo Implement
		 */
		clearCanvas: function() {
			return undefined;
		},

		/**
		 * Renders the shape results onto the canvas element.
		 *
		 * @this {CanvasRenderer}
		 * @param {Boolean[][][]} shape A 3d matrix of booleans
		 * @param {number} highlightLevel the level at which the levels above disappear
		 */
		render: function(shape, highlightLevel) {
			if (highlightLevel == undefined) {
				highlightLevel = -1;
			}

			var totalX = shape[0][0].length,
				totalY = shape[0].length,
				totalZ = shape.length,
				i, j,
				size = this.getCanvasSize(
					totalX,
					totalY,
					totalZ
				),
				context,
				isCulled = {},
				maxPlanes = totalZ + totalX + totalY,
				planePos = [],
				startZ,
				xSub,
				p, pos,
				z, y, x, x2, min, key, plane;

			this.canvas.setAttribute('style', 'max-width:100%');
			this.canvas.setAttribute('width', size.width +'px');
			this.canvas.setAttribute('height', size.height +'px');

			context = this.canvas.getContext('2d');

			for (i = 0; i < maxPlanes; i++) {
				planePos.push([]);
			}

			startZ = highlightLevel >= 0 ? highlightLevel : totalZ - 1;

			xSub = totalX - 1;

			for (z = startZ; z >= 0; z--) {
				for (y = 0; y < totalY; y++) {
					for (x = xSub; x >= 0; x--) {
						try {
							if (shape[z][y][x]) {
								x2 = xSub - x;
								min = Math.min(x2, y, z);
								key = [x2 - min, y - min, z - min].join(':');
								plane = (x2 + y + z);

								if ((highlightLevel >= 0 && z <= highlightLevel) || (highlightLevel <= 0)) {

									if (! isCulled.hasOwnProperty(key)) {

										isCulled[key] = plane;
										planePos[plane].push({
											x: x,
											y: y,
											z: z
										});
									}
								}
							}
						} catch (ex) {
							console.error(ex.message);
						}
					}
				}
			}

			for (i = 0; i < maxPlanes; i++) {
				for (j in planePos[i]) {
					if (planePos[i].hasOwnProperty(j)) {
						p = planePos[i][j];
						pos = this.project(p.x, p.y, p.z, size.origin);

						this.drawCubePrerendered(context, pos.x, pos.y, false);
					}
				}
			}

			if (highlightLevel >= 0 && highlightLevel < totalZ) {

				z = highlightLevel + 1;
				for (y = 0; y < totalY; y++) {
					for (x = totalX - 1; x >= 0; x--) {
						try {
							if (shape[z][y][x]) {
								pos = this.project(x, y, z, size.origin);
								this.drawCubePrerendered(pos.x, pos.y, context, true);
							}
						} catch (ex) {
							console.error(ex.message);
						}
					}
				}
			}
		}
	};

	/**
	 * Gets a hypotenuse size given a canvas width and a 3d matrix size
	 *
	 * @param {number} width The width of the 3d matrix
	 * @param {number} depth The depth of the 3d matrix
	 * @param {number} height The depth of the 3d matrix
	 * @param {number} canvasWidth The width of the canvas in pixels
	 */
	CanvasRenderer.getHypotenuseSizeFromWidth = function(width, depth, height, canvasWidth) {
		return (canvasWidth / (width + depth)) / COS_THIRTY;
	};

	/**
	 * Gets a hypotenuse size given a canvas height and a 3d matrix size
	 *
	 * @param {number} width The width of the 3d matrix
	 * @param {number} depth The depth of the 3d matrix
	 * @param {number} height The depth of the 3d matrix
	 * @param {number} canvasHeight The height of the canvas in pixels
	 */
	CanvasRenderer.getHypotenuseSizeFromHeight = function(width, depth, height, canvasHeight) {
		return (canvasHeight / (height + (( width + depth) * SIN_THIRTY)));
	};

	return CanvasRenderer;
});