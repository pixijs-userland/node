import { CanvasSource, type ICanvas } from 'pixi.js';
import { NodeCanvasElement } from './NodeCanvasElement';

/**
 * A canvas resource using node-canvas
 * used for images, svg, and bitmap text
 */
export class NodeCanvasSource extends CanvasSource
{
    static override test(resource: any): resource is ICanvas
    {
        return resource instanceof NodeCanvasElement;
    }
}
