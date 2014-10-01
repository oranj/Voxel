define(function() {

	var ConsoleRenderer = function() {};

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