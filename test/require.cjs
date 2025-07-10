const { WebGLRenderer, Container } = require('@pixi/node');

const stage = new Container();
const renderer = new WebGLRenderer();

(async () => {
	await renderer.init();
	renderer.render(stage);
	process.exit(0);
})();
