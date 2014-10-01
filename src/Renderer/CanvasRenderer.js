define(function() {

	var SIN_THIRTY = Math.sin(Math.PI / 6),
		COS_THIRTY = Math.cos(Math.PI / 6),

		transparentize = function(rgbHex, a) {

			var m = rgbHex.substring(1).match('([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})'),
				r = parseInt(m[1], 16),
				g = parseInt(m[2], 16),
				b = parseInt(m[3], 16);

			return 'rgba('+r+','+g+','+b+','+a+')';
		},

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
		}

		this.updateRenderingData(hypotenuseLength);

	};
	CanvasRenderer.prototype = {

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

		project: function(x, y, z, origin) {
			x = parseInt(x, 10);
			y = parseInt(y, 10);
			z = parseInt(z, 10);

			return {
				x: origin.x + (this.longLength * (x + y)),
				y: origin.y + (this.shortLength * (y - x)) + (this.hypotenuseLength * -1 * z)
			};
		},

		drawCube: function(context, x, y, transparent) {
			var colors = transparent ? this.transparentColors : this.colors;

			this.drawDiamondWithIndices(
				context, x, y,
				0, 1, 4, 5, colors.left);

			this.drawDiamondWithIndices(
				context, x, y,
				1, 2, 3, 4, colors.right);

			this.drawDiamondWithIndices(
				context, x, y,
				3, 4, 5, 6, colors.top);

		},

		drawCubePrerendered: function(context, x, y, transparent) {
			context.drawImage(this.hexCanvas, Math.round(x), Math.round(y) - 18);
		},

		drawDiamondWithIndices: function(context, x, y, index1, index2, index3, index4, color) {

			this.drawDiamondWithOffset(
				context,
				x, y,
				this.offsets[index1],
				this.offsets[index2],
				this.offsets[index3],
				this.offsets[index4],
				color
			);
		},

		drawDiamondWithOffset: function(context, x, y, offset1, offset2, offset3, offset4, color) {

			context.fillStyle = color;

			context.beginPath();

			context.moveTo(x + offset1.x, y + offset1.y);
			context.lineTo(x + offset2.x, y + offset2.y);
			context.lineTo(x + offset3.x, y + offset3.y);
			context.lineTo(x + offset4.x, y + offset4.y);
			context.closePath();

			context.fill();
		},

		getCanvasSize:  function(totalX, totalY, totalZ) {

			var width = (totalX + totalY) * this.longLength,
				height = (totalZ * this.hypotenuseLength) + ((totalX + totalY) * this.shortLength);

			return {
				width: width,
				height: height,
				origin: {
					x: 0,
					y: height - (totalY * this.shortLength)
				}
			};
		},

		clearCanvas: function() {

		},

		render: function(shape, highlightLevel) {
			if (highlightLevel == undefined) {
				highlightLevel = -1;
			}

			var totalX = shape[0][0].length;
				totalY = shape[0].length;
				totalZ = shape.length;

			var size = this.getCanvasSize(
				totalX,
				totalY,
				totalZ
			);

			this.canvas.setAttribute('style', 'max-width:100%');
			this.canvas.setAttribute('width', size.width +'px');
			this.canvas.setAttribute('height', size.height +'px');

			var context = this.canvas.getContext('2d');

			var maxDistance = Math.sqrt(
				Math.pow(totalX, 2) +
				Math.pow(totalY, 2) +
				Math.pow(totalZ, 2)
			);

			var isCulled = {};
			var maxPlanes = totalZ + totalX + totalY;

			var planePos = [];
			var highlights = [];

			for (var i = 0; i < maxPlanes; i++) {
				planePos.push([]);
			}

			var startZ = highlightLevel >= 0 ? highlightLevel : totalZ - 1;

			var xSub = totalX - 1;

			for (var z = startZ; z >= 0; z--) {
				for (var y = 0; y < totalY; y++) {
					for (var x = xSub; x >= 0; x--) {
						try {
							if (shape[z][y][x]) {
								var _x = xSub - x,
									min = Math.min(_x, y, z),
									key = [_x - min, y - min, z - min].join(':'),
									plane = (_x + y + z);

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

			var count = 0;
			for (var i = 0; i < maxPlanes; i++) {
				for (var j in planePos[i]) {
					if (planePos[i].hasOwnProperty(j)) {
						var p = planePos[i][j],
							pos = this.project(p.x, p.y, p.z, size.origin);

						this.drawCubePrerendered(context, pos.x, pos.y, false);
					}
				}
			}

			if (highlightLevel >= 0 && highlightLevel < totalZ) {

				var z = highlightLevel + 1;
				for (var y = 0; y < totalY; y++) {
					for (var x = totalX - 1; x >= 0; x--) {
						try {
							if (shape[z][y][x]) {
								var pos = this.project(x, y, z, size.origin);
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

	CanvasRenderer.getHypotenuseSizeFromWidth = function(totalX, totalY, totalZ, canvasWidth) {

		return (canvasWidth / (totalX + totalY)) / COS_THIRTY;
	};

	CanvasRenderer.getHypotenuseSizeFromHeight = function(totalX, totalY, totalZ, canvasHeight) {

		return (canvasHeight / (totalZ + (( totalX + totalY) * SIN_THIRTY)));
	};

	return CanvasRenderer;
});