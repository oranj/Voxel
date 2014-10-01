# Voxels

They are your friend.

We have **shapes** and **renderers**.

Example.

```js

require.config({
	baseUrl: '/js/app/',
	paths: {
		vox: '/js/vox-lib/src'
	}
});

require(
	['vox/Renderer/CanvasRenderer', 'vox/Shape/Bezier'],
	function(CanvasRenderer, Bezier) {

		var canvasElement = document.getElementById('renderCanvas');

		var shape = new Bezier(40, 40, 100, 1.5,
				[0, 0.35, .69, 1],
				[0, 0.97, 0.09, 1],
				'x'
			),

			renderer = new CanvasRenderer(
				canvasElement, 12,
				'#1E527D',
				'#6795BA',
				'#26679c'
			);
			results = shape.generate3d();

		renderer.render(results);

	}
);

```