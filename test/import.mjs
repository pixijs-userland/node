import { Container, WebGLRenderer } from '@pixi/node';

const stage = new Container();
const renderer = new WebGLRenderer();

await renderer.init();
renderer.render(stage);
process.exit(0);
