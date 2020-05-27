declare module "voxel/General/BinomialCoefficient" {
    /**
     * A function for determining binomial coefficients. Memoized for speed
     *
     * @constructor
     */
    export default class BinomialCoefficient {
        private cache;
        /**
         * Gets the binomial coefficient using the recursive formula
         *
         * @see http://en.wikipedia.org/wiki/Binomial_coefficient
         *
         * @param  {number} n The number of coefficients
         * @param  {number} k The index of the coefficient
         * @return {number}   The binomial coefficient
         */
        get(n: number, k: number): number;
    }
}
declare module "voxel/General/BezierFunction" {
    import BinomialCoefficient from "voxel/General/BinomialCoefficient";
    export default class BezierFunction {
        private readonly values;
        private readonly coefficients;
        /**
         * Constructs a new Bezier calculator.
         *
         * @constructor
         * @param {number[]} values       An array of numbers for the bezier function
         * @param {BinomialCoefficient} coefficients A binomial coefficient generator
         */
        constructor(values: number[], coefficients: BinomialCoefficient);
        /**
         * Gets the value of the bezier function at a provided time.
         *
         * @param  {number} time A value between 0 and 1
         * @return {number}      The value at the provided time
         */
        getAt(time: number): number;
    }
}
declare module "voxel/Shape/ShapeInterface" {
    export type Shape2D = boolean[][];
    export type Shape3D = Shape2D[];
    export interface ShapeInterface {
        readonly width: number;
        readonly height: number;
        readonly depth: number;
        readonly thickness?: number;
        generate3d(): Shape3D;
    }
}
declare module "voxel/Renderer/CanvasRenderer" {
    import { Shape3D } from "voxel/Shape/ShapeInterface";
    interface Point {
        x: number;
        y: number;
    }
    export default class CanvasRenderer {
        private readonly canvas;
        private hypotenuseLength;
        private readonly colors;
        private readonly transparentColors;
        private shortLength?;
        private longLength?;
        private offsets;
        private hexCanvasTrans?;
        private hexCanvas?;
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
        constructor(canvas: HTMLCanvasElement, hypotenuseLength: number, leftColor: string, topColor: string, rightColor: string);
        /**
         * Sets the desired hypotenuse length for each rendered diamond.
         */
        updateRenderingData(hypotenuseLength: number): void;
        /**
         * Given voxel indices, projects them into 2 dimensional space
         *
         * @this {CanvasRenderer}
         * @param {number} x the x index
         * @param {number} y the y index
         * @param {number} z the z index
         * @param {origin} the point at which <0,0> should be rendered.
         */
        project(x: number | string, y: number | string, z: number | string, origin: Point): Point;
        /**
         * Renders a cube into the provided context
         * @param {CanvasRenderingContext2D} context The context in which to render
         * @param {number} x The x position of the cube
         * @param {number} y The y position of the cube
         * @param {Boolean} transparent Whether or not to draw the cube transparently
         */
        drawCube(context: CanvasRenderingContext2D, x: number, y: number, transparent: boolean): void;
        /**
         * Draws the prerendered cube onto the canvas
         *
         * @this {CanvasRenderer}
         * @param {CanvasRenderingContext2D} context The context in which to render
         * @param {number} x The x position of the cube
         * @param {number} y The y position of the cube
         * @param {Boolean} transparent Whether or not to draw the cube transparently
         */
        drawCubePrerendered(context: CanvasRenderingContext2D, x: number, y: number, transparent: boolean): void;
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
        drawDiamond(context: CanvasRenderingContext2D, x: number, y: number, offset1: Point, offset2: Point, offset3: Point, offset4: Point, color: string): void;
        /**
         * Given the size of a result matrix, gets size information
         *
         * @param  {number} width The width of the result matrix
         * @param  {number} depth The depth of the result matrix
         * @param  {number} height The height of the result matrix
         * @return {mixed}        The width and height of the canvas, as well as the center.
         */
        getCanvasSize(width: number, depth: number, height: number): {
            width: number;
            height: number;
            origin: Point;
        };
        /**
         * Clears the canvas
         *
         * @this {CanvasRenderer}
         * @todo Implement
         */
        clearCanvas(): void;
        /**
         * Renders the shape results onto the canvas element.
         *
         * @param shape A 3d matrix of booleans
         * @param highlightLevel the level at which the levels above disappear
         */
        render(shape: Shape3D, highlightLevel?: number): void;
        /**
         * Gets a hypotenuse size given a canvas width and a 3d matrix size
         *
         * @param {number} width The width of the 3d matrix
         * @param {number} depth The depth of the 3d matrix
         * @param {number} height The depth of the 3d matrix
         * @param {number} canvasWidth The width of the canvas in pixels
         */
        static getHypotenuseSizeFromWidth(width: number, depth: number, height: number, canvasWidth: number): number;
        /**
         * Gets a hypotenuse size given a canvas height and a 3d matrix size
         *
         * @param {number} width The width of the 3d matrix
         * @param {number} depth The depth of the 3d matrix
         * @param {number} height The depth of the 3d matrix
         * @param {number} canvasHeight The height of the canvas in pixels
         */
        static getHypotenuseSizeFromHeight(width: number, depth: number, height: number, canvasHeight: number): number;
    }
}
declare module "voxel/Renderer/ConsoleRenderer" {
    import { Shape3D } from "voxel/Shape/ShapeInterface";
    export default class ConsoleRenderer {
        render(matrix: Shape3D): void;
    }
}
declare module "voxel/Renderer/SvgLayerRenderer" {
    import { Shape3D } from "voxel/Shape/ShapeInterface";
    export default class SvgLayerRenderer {
        private readonly bumpHeight;
        constructor(bumpHeight: number);
        generateLayerSvg(shape: Shape3D, layerIndex: number): Document | null;
    }
}
declare module "voxel/Shape/BaseShape" {
    import { ShapeInterface, Shape2D, Shape3D } from "voxel/Shape/ShapeInterface";
    export default abstract class BaseShape implements ShapeInterface {
        readonly width: number;
        readonly depth: number;
        readonly height: number;
        readonly thickness?: number | undefined;
        /**
         * Constructor for the BaseShape
         *
         * @constructor
         * @param {number} width     The width of the shape
         * @param {number} depth     The depth of the shape
         * @param {number} height    The height of the shape
         * @param {number|undefined} thickness The thickness of the shape, undefined if solid
         */
        constructor(width: number, depth: number, height: number, thickness?: number | undefined);
        abstract generate3d(): Shape3D;
        checkDistance(distance: number, radius: number): boolean;
        /**
         * Given a radius, generates a 2d matrix of booleans
         */
        generateRotation(radius: number): Shape2D;
    }
}
declare module "voxel/Shape/Bezier" {
    import BaseShape from "voxel/Shape/BaseShape";
    import { Shape3D } from "voxel/Shape/ShapeInterface";
    export default class Bezier extends BaseShape {
        private readonly pointsY;
        private readonly axis;
        private readonly bezierFunctionX;
        private readonly bezierFunctionY;
        private readonly minRadius;
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
        constructor(width: number, depth: number, height: number, thickness: number | undefined, pointsX: number[], pointsY: number[], axis: "x" | "y" | "z");
        /**
         * Gets a point along the bezier's curve
         *
         * @this {Bezier}
         * @param  {number} time A time according to the bezier control points
         * @return {object}      An x/y pair of point values
         */
        getPoint(time: number): {
            x: number;
            y: number;
        };
        /**
         * Generates a 3d matrix of booleans indicating if the cell is occupied
         * @return {Boolean[][][]} A matrix of if the cell is occupied
         */
        generate3d(): Shape3D;
    }
}
declare module "voxel/Shape/Cone" {
    import BaseShape from "voxel/Shape/BaseShape";
    import { Shape3D } from "voxel/Shape/ShapeInterface";
    export default class Cone extends BaseShape {
        private minRadius;
        /**
         * Constructs a Cone object
         *
         * @constructor
         * @param {number} width         The width of the shape
         * @param {number} depth         The depth of the shape
         * @param {number} height         The height of the shape
         * @param {number|null} thickness The thickness of the shape, or undefined if hollow
         */
        constructor(width: number, depth: number, height: number, thickness?: number);
        /**
         * Generates a 3d matrix of booleans indicating if the cell is occupied
         *
         * @this {Cone}
         * @return {Boolean[][][]}
         */
        generate3d(): Shape3D;
    }
}
declare module "voxel/Shape/Dome" {
    import BaseShape from "voxel/Shape/BaseShape";
    import { Shape3D } from "voxel/Shape/ShapeInterface";
    export default class Dome extends BaseShape {
        private minRadius;
        private adjustedMinRadius;
        /**
         * Constructs a Dome object
         *
         * @constructor
         * @param {number} width         The width of the shape
         * @param {number} depth         The depth of the shape
         * @param {number} height         The height of the shape
         * @param {number|null} thickness The thickness of the shape, or undefined if hollow
         */
        constructor(width: number, depth: number, height: number, thickness?: number);
        /**
         * Generates a 3d matrix of booleans indicating if the cell is occupied
         *
         * @this {Dome}
         * @return {Boolean[][][]}
         */
        generate3d(): Shape3D;
    }
}
declare module "voxel/Shape/Sphere" {
    import BaseShape from "voxel/Shape/BaseShape";
    import { Shape3D } from "voxel/Shape/ShapeInterface";
    export default class Sphere extends BaseShape {
        private adjustedMinRadius;
        /**
         * Constructs a Sphere object
         *
         * @constructor
         * @param {number} width         The width of the shape
         * @param {number} depth         The depth of the shape
         * @param {number} height         The height of the shape
         * @param {number|null} thickness The thickness of the shape, or undefined if hollow
         */
        constructor(width: number, depth: number, height: number, thickness?: number);
        /**
         * Generates a 3d matrix of booleans indicating if the cell is occupied
         */
        generate3d(): Shape3D;
    }
}
declare module "Voxel" {
    import BezierFunction from "voxel/General/BezierFunction";
    import BinomialCoefficient from "voxel/General/BinomialCoefficient";
    import CanvasRenderer from "voxel/Renderer/CanvasRenderer";
    import ConsoleRenderer from "voxel/Renderer/ConsoleRenderer";
    import SvgLayerRenderer from "voxel/Renderer/SvgLayerRenderer";
    import BaseShape from "voxel/Shape/BaseShape";
    import Bezier from "voxel/Shape/Bezier";
    import Cone from "voxel/Shape/Cone";
    import Dome from "voxel/Shape/Dome";
    export { ShapeInterface, Shape3D, Shape2D } from "voxel/Shape/ShapeInterface";
    import Sphere from "voxel/Shape/Sphere";
    const Voxel: {
        General: {
            BezierFunction: typeof BezierFunction;
            BinomialCoefficient: typeof BinomialCoefficient;
        };
        Renderer: {
            CanvasRenderer: typeof CanvasRenderer;
            ConsoleRenderer: typeof ConsoleRenderer;
            SvgLayerRenderer: typeof SvgLayerRenderer;
        };
        Shape: {
            BaseShape: typeof BaseShape;
            Bezier: typeof Bezier;
            Cone: typeof Cone;
            Dome: typeof Dome;
            Sphere: typeof Sphere;
        };
    };
    export default Voxel;
}
