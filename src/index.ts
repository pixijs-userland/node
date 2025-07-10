import { browserExt, DOMPipe, extensions, VideoSource, ResizePlugin, detectMp4, detectOgv, detectWebm, loadTextures, loadWebFont, AccessibilitySystem, EventSystem } from 'pixi.js';
import { NodeCanvasSource, loadNodeBase64, loadNodeFont, loadNodeTexture } from './adapter';

// Remove the default loader plugins
extensions.remove(
    detectMp4,
    detectOgv,
    detectWebm,
    loadTextures,
    loadWebFont,
    VideoSource
);

// reset installed resources and remove resize plugin from Application
extensions.add(
    NodeCanvasSource,
    loadNodeBase64,
    loadNodeFont,
    loadNodeTexture
);

// Some extensions are not added at the import stage.
// Remove them after they are added in browserExt.load().
const oldBrowserExtLoad = browserExt.load;
browserExt.load = async () => {
    await oldBrowserExtLoad.call(browserExt);
    extensions.remove(DOMPipe, ResizePlugin, AccessibilitySystem, EventSystem);
}

// Export ES for those importing specifically by name
export * from 'pixi.js';

// Export adapter
export * from './adapter';
