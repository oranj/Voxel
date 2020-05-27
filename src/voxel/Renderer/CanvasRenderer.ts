import { Shape3D } from "../Shape/ShapeInterface";

const SIN_THIRTY = Math.sin(Math.PI / 6);
const COS_THIRTY = Math.cos(Math.PI / 6);

interface Point {
	x: number;
	y: number;
}

/**
 * Converts a hex string into an rgba transparent string
 *
 * @param {string} rgbHex the hex color to transparentize
 * @param {number} a The alpha value
 * @return {string} The transparent string
 */
function transparentize(rgbHex: string, a: number|string): string {
	const m: null|string[] = rgbHex.substring(1).match("([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})");
	if (m === null) {
		throw new Error("Invalid hex value " + rgbHex);
	}
	const r = parseInt(m[1], 16);
	const g = parseInt(m[2], 16);
	const b = parseInt(m[3], 16);

	return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

interface ColorSet {
	left: string;
	right: string;
	top: string;
}

export default class CanvasRenderer {

	private readonly colors: ColorSet;
	private readonly transparentColors: ColorSet;
	private shortLength?: number;
	private longLength?: number;
	private offsets: Point[] = [];
	private hexCanvasTrans?: HTMLCanvasElement;
	private hexCanvas?: HTMLCanvasElement;


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
	constructor(
		private readonly canvas: HTMLCanvasElement,
		private hypotenuseLength: number,
		leftColor: string,
		topColor: string,
		rightColor: string
	) {

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
	}

	/**
	 * Sets the desired hypotenuse length for each rendered diamond.
	 */
	updateRenderingData(hypotenuseLength: number): void {
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

		this.hexCanvas = document.createElement("canvas");
		this.hexCanvas.setAttribute("width", String(Math.ceil(2 * this.longLength)));
		this.hexCanvas.setAttribute("height", String(Math.ceil(2 * this.longLength) + 3));

		this.hexCanvasTrans = document.createElement("canvas");
		this.hexCanvasTrans.setAttribute("width", String(Math.ceil(2 * this.longLength)));
		this.hexCanvasTrans.setAttribute("height", String(Math.ceil(2 * this.longLength) + 3));

		let ctx = this.hexCanvas.getContext("2d") as unknown as CanvasRenderingContext2D;
		this.drawCube(ctx, 0, this.shortLength + this.longLength + 2, false);

		ctx = this.hexCanvasTrans.getContext("2d") as unknown as CanvasRenderingContext2D;
		this.drawCube(ctx, 0, this.shortLength + this.longLength + 2, true);
	}

	/**
	 * Given voxel indices, projects them into 2 dimensional space
	 *
	 * @this {CanvasRenderer}
	 * @param {number} x the x index
	 * @param {number} y the y index
	 * @param {number} z the z index
	 * @param {origin} the point at which <0,0> should be rendered.
	 */
	project(x: number|string, y: number|string, z: number|string, origin: Point): Point {
		if (this.longLength === undefined || this.shortLength === undefined) {
			throw new Error("Invalid state");
		}
		x = parseInt(String(x), 10);
		y = parseInt(String(y), 10);
		z = parseInt(String(z), 10);

		return {
			x: origin.x + (this.longLength * (x + y)),
			y: origin.y + (this.shortLength * (y - x)) + (this.hypotenuseLength * -1 * z)
		};
	}

	/**
	 * Renders a cube into the provided context
	 * @param {CanvasRenderingContext2D} context The context in which to render
	 * @param {number} x The x position of the cube
	 * @param {number} y The y position of the cube
	 * @param {Boolean} transparent Whether or not to draw the cube transparently
	 */
	drawCube(context: CanvasRenderingContext2D, x: number, y: number, transparent: boolean): void {
		const colors = transparent ? this.transparentColors : this.colors;

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
	}

	/**
	 * Draws the prerendered cube onto the canvas
	 *
	 * @this {CanvasRenderer}
	 * @param {CanvasRenderingContext2D} context The context in which to render
	 * @param {number} x The x position of the cube
	 * @param {number} y The y position of the cube
	 * @param {Boolean} transparent Whether or not to draw the cube transparently
	 */
	drawCubePrerendered(context: CanvasRenderingContext2D, x: number, y: number, transparent: boolean): void {
		if (this.hexCanvasTrans === undefined || this.hexCanvas === undefined) {
			throw new Error("Invalid canvas state");
		}
		const canvas = transparent ? this.hexCanvasTrans : this.hexCanvas;
		context.drawImage(canvas, Math.round(x), Math.round(y) - 18);
	}

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
	drawDiamond(context: CanvasRenderingContext2D, x: number, y: number, offset1: Point, offset2: Point, offset3: Point, offset4: Point, color: string) {

		context.fillStyle = color;

		context.beginPath();

		context.moveTo(x + offset1.x, y + offset1.y);
		context.lineTo(x + offset2.x, y + offset2.y);
		context.lineTo(x + offset3.x, y + offset3.y);
		context.lineTo(x + offset4.x, y + offset4.y);
		context.closePath();

		context.fill();
	}

	/**
	 * Given the size of a result matrix, gets size information
	 *
	 * @param  {number} width The width of the result matrix
	 * @param  {number} depth The depth of the result matrix
	 * @param  {number} height The height of the result matrix
	 * @return {mixed}        The width and height of the canvas, as well as the center.
	 */
	getCanvasSize(width: number, depth: number, height: number): { width: number, height: number, origin: Point } {
		if (this.longLength === undefined || this.shortLength === undefined) {
			throw new Error("Uninitialized triangle lengths");
		}

		const canvasWidth = (width + depth) * this.longLength;
		const canvasHeight = (height * this.hypotenuseLength) + ((width + depth) * this.shortLength);

		return {
			width: canvasWidth,
			height: canvasHeight,
			origin: {
				x: 0,
				y: canvasHeight - (depth * this.shortLength)
			}
		};
	}

	/**
	 * Clears the canvas
	 *
	 * @this {CanvasRenderer}
	 * @todo Implement
	 */
	clearCanvas(): void { }

	/**
	 * Renders the shape results onto the canvas element.
	 *
	 * @param shape A 3d matrix of booleans
	 * @param highlightLevel the level at which the levels above disappear
	 */
	render(shape: Shape3D, highlightLevel: number = -1): void {
		const totalX = shape[0][0].length;
		const totalY = shape[0].length;
		const totalZ = shape.length;
		const size = this.getCanvasSize(
			totalX,
			totalY,
			totalZ
		);
		const isCulled: { [key: string]: number} = { };
		const maxPlanes = totalZ + totalX + totalY;
		const planePos: Array<Array<{ x: number, y: number, z: number}>> = [];

		this.canvas.setAttribute("style", "max-width:100%");
		this.canvas.setAttribute("width", size.width + "px");
		this.canvas.setAttribute("height", size.height + "px");

		const context = this.canvas.getContext("2d") as unknown as CanvasRenderingContext2D;

		for (let i = 0; i < maxPlanes; i++) {
			planePos.push([]);
		}

		const startZ = highlightLevel >= 0 ? highlightLevel : totalZ - 1;
		const xSub = totalX - 1;

		for (let z = startZ; z >= 0; z--) {
			for (let y = 0; y < totalY; y++) {
				for (let x = xSub; x >= 0; x--) {
					try {
						if (!shape[z][y][x]) {
							continue;
						}
						const x2 = xSub - x;
						const min = Math.min(x2, y, z);
						const key = [x2 - min, y - min, z - min].join(":");
						const plane = (x2 + y + z);

						if (!((highlightLevel >= 0 && z <= highlightLevel) || (highlightLevel <= 0))) {
							continue;
						}

						if (isCulled.hasOwnProperty(key)) {
							continue;
						}

						isCulled[key] = plane;
						planePos[plane].push({ x, y, z });
					} catch (ex) {
						console.error(ex.message);
					}
				}
			}
		}

		for (let i = 0; i < maxPlanes; i++) {
			for (const j in planePos[i]) {
				if (!planePos[i].hasOwnProperty(j)) {
					continue;
				}
				const p = planePos[i][j];
				const pos = this.project(p.x, p.y, p.z, size.origin);

				this.drawCubePrerendered(context, pos.x, pos.y, false);
			}
		}

		if (highlightLevel >= 0 && highlightLevel < totalZ) {
			const z = highlightLevel + 1;
			for (let y = 0; y < totalY; y++) {
				for (let x = totalX - 1; x >= 0; x--) {
					try {
						if (shape[z][y][x]) {
							const pos = this.project(x, y, z, size.origin);
							this.drawCubePrerendered(context, pos.x, pos.y, true);
						}
					} catch (ex) {
						console.error(ex.message);
					}
				}
			}
		}
	}


	/**
	 * Gets a hypotenuse size given a canvas width and a 3d matrix size
	 *
	 * @param {number} width The width of the 3d matrix
	 * @param {number} depth The depth of the 3d matrix
	 * @param {number} height The depth of the 3d matrix
	 * @param {number} canvasWidth The width of the canvas in pixels
	 */
	static getHypotenuseSizeFromWidth(width: number, depth: number, height: number, canvasWidth: number): number {
		return (canvasWidth / (width + depth)) / COS_THIRTY;
	}

	/**
	 * Gets a hypotenuse size given a canvas height and a 3d matrix size
	 *
	 * @param {number} width The width of the 3d matrix
	 * @param {number} depth The depth of the 3d matrix
	 * @param {number} height The depth of the 3d matrix
	 * @param {number} canvasHeight The height of the canvas in pixels
	 */
	static getHypotenuseSizeFromHeight(width: number, depth: number, height: number, canvasHeight: number): number {
		return (canvasHeight / (height + ((width + depth) * SIN_THIRTY)));
	}
}
