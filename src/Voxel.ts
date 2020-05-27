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

const Voxel = {
	General: {
		BezierFunction,
		BinomialCoefficient
	},
	Renderer: {
		CanvasRenderer,
		ConsoleRenderer,
		SvgLayerRenderer
	},
	Shape: {
		BaseShape,
		Bezier,
		Cone,
		Dome,
		Sphere
	}
};


export default Voxel;
