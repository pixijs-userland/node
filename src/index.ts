import {
    AccessibilitySystem, browserExt, detectMp4, detectOgv, detectWebm,
    DOMPipe, EventSystem, extensions, loadTextures, loadWebFont, ResizePlugin, VideoSource
} from 'pixi.js';
import { loadNodeBase64, loadNodeFont, loadNodeTexture, NodeCanvasSource } from './adapter';

// Remove the default loader plugins
extensions.remove(
    detectMp4,
    detectOgv,
    detectWebm,
    loadTextures,
    loadWebFont,
    VideoSource
);

// Add Node-specific extensions
extensions.add(
    NodeCanvasSource,
    loadNodeBase64,
    loadNodeFont,
    loadNodeTexture
);

// Some extensions are not added at the import stage.
// Remove them after they are added in browserExt.load().
const oldBrowserExtLoad = browserExt.load;

browserExt.load = async () =>
{
    await oldBrowserExtLoad.call(browserExt);
    extensions.remove(DOMPipe, ResizePlugin, AccessibilitySystem, EventSystem);
};

// Export ES for those importing specifically by name
export * from 'pixi.js';

// Export adapter
export * from './adapter';
