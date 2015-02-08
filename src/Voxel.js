define(["vox/General/BezierFunction","vox/General/BinomialCoefficient","vox/Renderer/CanvasRenderer","vox/Renderer/ConsoleRenderer","vox/Renderer/SvgLayerRenderer","vox/Shape/BaseShape","vox/Shape/Bezier","vox/Shape/Cone","vox/Shape/Dome","vox/Shape/Sphere"], function(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9){
	"use strict";
	return {
		General: {
			BezierFunction:a0,
			BinomialCoefficient:a1
		},
		Renderer: {
			CanvasRenderer:a2,
			ConsoleRenderer:a3,
			SvgLayerRenderer:a4
		},
		Shape: {
			BaseShape:a5,
			Bezier:a6,
			Cone:a7,
			Dome:a8,
			Sphere:a9
		}
	};
});
