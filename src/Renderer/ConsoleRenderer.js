define(function() {
	"use strict";

	/**
	 * Constructs a new ConsoleRenderer object
	 *
	 * @constructor
	 * @this {ConsoleRenderer}
	 */
	var ConsoleRenderer = function() { return undefined; };

	/**
	 * Renders a 3d matrix to the console
	 *
	 * @this {ConsoleRenderer}
	 * @param {Boolean[][][]} matrix
	 */
	ConsoleRenderer.prototype.render = function(matrix) {
		var z, y, x, str = '';
		for (z = 0; z < matrix.length; z++) {
			str = "";
			for (y = 0; y < matrix[z].length; y++) {
				for (x = 0; x < matrix[z][y].length; x++) {
					str += matrix[z][y][x] ? 'X' : '-';
				}
				str += "\n";
			}
			console.log(str+"\n");
		}
		console.log(matrix);

	};

	return ConsoleRenderer;

});