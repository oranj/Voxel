export type Shape2D = boolean[][];

export type Shape3D = Shape2D[];

export interface ShapeInterface {

	readonly width: number;
	readonly height: number;
	readonly depth: number;
	readonly thickness?: number;

	generate3d(): Shape3D;
}
