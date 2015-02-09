define([], function() {
	"use strict";

	function roundDec(floatVal, numDec) {
		var mult = Math.pow(10, numDec),
			val = Math.round(floatVal * mult) / mult;

		return val;
	}

	function stringToDoc(text) {
		var parser, xmlDoc = null;
		if (! text || (typeof text) != "string") {
			return null;
		}
		try {
			if (window.DOMParser) {
				parser = new window.DOMParser();
				xmlDoc = parser.parseFromString(text, "text/xml");
			} else { // IE lt 10
				xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = false;
				xmlDoc.loadXML(text);
			}
		} catch (ignore) {}
		if (xmlDoc && xmlDoc.documentElement && ! xmlDoc.getElementsByTagName('parsererror').length) {

			return xmlDoc;
		}
		throw new Error("Invalid XML: " + text);
	}

	var SvgLayerRenderer = function(bumpHeight) {
		this.bumpHeight = bumpHeight || 0.25;
	};

	SvgLayerRenderer.prototype = {

		generateLayerSvg: function(shape, layerIndex) {
			var layer, doc, x, y, ySize, xSize, rectClass, bump, thisBump, width;
			if (! shape.hasOwnProperty(layerIndex)) {
				throw new Error("Invalid layer: `" + layerIndex+ "`");
			}
			layer = shape[layerIndex];

			ySize = roundDec((1 / layer.length) * 100, 2);
			width = roundDec(100 * (layer[0].length / layer.length), 2);

			xSize = roundDec((1 / layer[0].length) * width, 2);
			bump  = roundDec(ySize * this.bumpHeight, 2);


			doc = "<svg  xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 "+width+" " + (100 + bump)+"\">\n";

			for (y = 0; y < layer.length; y++) {
				for (x = 0; x < layer[y].length; x++) {
					rectClass = null;
					thisBump = 0;
					if (layer[y][x]) {
						rectClass="shape";
						// draw something here
					} else if (layerIndex > 0 && shape[layerIndex - 1][y][x]) {
						thisBump = bump;
						rectClass="shapeBelow";
					} else if ((x + y) & 1) {
						thisBump = bump;
						rectClass="fill";
						// draw other layer
					}

					if (rectClass !== null) {
						doc += '<rect class="'+rectClass+'" ';
						if (rectClass == 'shape') {
							doc += 'data-x="'+x+'" ';
							doc += 'data-y="'+y+'" ';
							doc += 'data-z="'+layerIndex+'" ';

						}
						doc += 'y="'+  roundDec((y * ySize) + thisBump, 2)+'" ';
						doc += 'height="'+ySize+'" ';
						doc += 'width="'+xSize+'" ';
						doc += 'x="'+ roundDec((x * xSize), 2) + '" />\n';
					}
					if (layer[y][x] && (y == layer.length - 1 || ! layer[y+1][x])) {
						doc += '<rect class="bump" ' +
							'y="'+  roundDec(((y + 1) * ySize), 2)+'" ' +
							'height="'+bump+'" ' +
							'width="'+xSize+'" ' +
							'x="'+ roundDec((x * xSize), 2) + '" />\n';
					}


				}
			}
			doc += "</svg>";
			return stringToDoc(doc);
		}

	};

	return SvgLayerRenderer;

});