import { Shape3D } from "../Shape/ShapeInterface";

export default class ConsoleRenderer {
	render(matrix: Shape3D): void {
		for (let z = 0; z < matrix.length; z++) {
			let str = "";
			for (let y = 0; y < matrix[z].length; y++) {
				for (let x = 0; x < matrix[z][y].length; x++) {
					str += matrix[z][y][x] ? "X" : "-";
				}
				str += "\n";
			}
			console.log(str + "\n"); // tslint:disable-line
		}
	}
}
