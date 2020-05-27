import { Shape3D } from "../Shape/ShapeInterface";

function roundDec(floatVal: number, numDec: number): number {
	const mult = Math.pow(10, numDec);
	return Math.round(floatVal * mult) / mult;
}

function stringToDoc(text: string): Document|null {
	if (! text || (typeof text) != "string") {
		return null;
	}
	let xmlDoc: Document|undefined;
	try {
		if ((window as any).DOMParser) {
			const parser = new (window as any).DOMParser();
			xmlDoc = parser.parseFromString(text, "text/xml");
		} else { // IE lt 10
			xmlDoc = new (window as any).ActiveXObject("Microsoft.XMLDOM");
			(xmlDoc as unknown as any).async = false;
			(xmlDoc as unknown as any).loadXML(text);
		}
	} catch (ignore) { }
	if (xmlDoc && xmlDoc.documentElement && ! xmlDoc.getElementsByTagName("parsererror").length) {
		return xmlDoc;
	}
	throw new Error("Invalid XML: " + text);
}

export default class SvgLayerRenderer {
	constructor(private readonly bumpHeight: number) {	}

	generateLayerSvg(
		shape: Shape3D,
		layerIndex: number
	): Document|null {
		if (! shape.hasOwnProperty(layerIndex)) {
			throw new Error("Invalid layer: `" + layerIndex + "`");
		}
		const layer = shape[layerIndex];

		const ySize = roundDec((1 / layer.length) * 100, 2);
		const width = roundDec(100 * (layer[0].length / layer.length), 2);
		const xSize = roundDec((1 / layer[0].length) * width, 2);
		const bump  = roundDec(ySize * this.bumpHeight, 2);

		let doc = "<svg  xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 "+width+" " + (100 + bump)+"\">\n";

		for (let y = 0; y < layer.length; y++) {
			for (let x = 0; x < layer[y].length; x++) {
				let rectClass: string|null = null;
				let thisBump: number = 0;
				if (layer[y][x]) {
					rectClass = "shape";
					// draw something here
				} else if (layerIndex > 0 && shape[layerIndex - 1][y][x]) {
					thisBump = bump;
					rectClass = "shapeBelow";
				} else if ((x + y) & 1) {
					thisBump = bump;
					rectClass = "fill";
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
				if (layer[y][x] && (y == layer.length - 1 || ! layer[y + 1][x])) {
					doc += '<rect class="bump" ' +
						'y="' +  roundDec(((y + 1) * ySize), 2) + '" ' +
						'height="' + bump + '" ' +
						'width="' + xSize + '" ' +
						'x="' + roundDec((x * xSize), 2) + '" />\n';
				}
			}
		}
		doc += "</svg>";
		return stringToDoc(doc);
	}
}
