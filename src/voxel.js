define(['vox/Shape/Cone', 'vox/Renderer/ConsoleRenderer'], function(Sphere, ConsoleRenderer) {




	var sphere = new Sphere(5, 5, 5, 1),
		renderer = new ConsoleRenderer();

	renderer.render(sphere.generate3d());

});