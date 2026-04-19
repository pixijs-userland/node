import { CanvasRenderingContext2D } from 'canvas';
import { fetch, Request, Response } from 'cross-fetch';
import fs from 'fs';
import { WebGLRenderingContext } from 'gl';
import { DOMAdapter, path } from 'pixi.js';
import { NodeCanvasElement } from './NodeCanvasElement';
import { NodeImage } from './NodeImage';
import { DOMParser } from '@xmldom/xmldom';

import type { Adapter } from 'pixi.js';

export const NodeAdapter = {
    /**
     * Creates a canvas element of the given size.
     * This canvas is created using the node-canvas package and uses the gl package to create a webgl context.
     * @param width - width of the canvas
     * @param height - height of the canvas
     */
    createCanvas: (width?: number, height?: number) => new NodeCanvasElement(width, height),
    getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
    createImage: () => new NodeImage(),
    /** Returns a WebGL rendering context using the gl package. */
    getWebGLRenderingContext: () => WebGLRenderingContext,
    /** Returns the fake user agent string of `node` */
    getNavigator: () => ({ userAgent: 'node' }),
    /** Returns the path from which the process is being run */
    getBaseUrl: () => process.cwd(),
    getFontFaceSet: (): any => null,
    fetch: (url: RequestInfo, options?: RequestInit) =>
    {
        const request = new Request(url, options);

        // Check if urls starts with http(s) as only these are supported by node-fetch
        if (path.isUrl(request.url))
        {
            return fetch(url, request);
        }

        return new Promise((resolve, reject) =>
        {
            // Request transforms paths and encodeURIs, but for filesystem requests,
            // it's better to use the raw string (path).
            // If url is a request instead, decode the URI before trying to access the file
            const rawPath = typeof url === 'string' ? url : decodeURI(request.url);

            // Normalize the path
            const filePath = path.normalize(rawPath);

            if (!fs.existsSync(filePath))
            {
                reject(`File not found: ${filePath}`);
            }
            const readStream = fs.createReadStream(filePath);

            readStream.on('open', () =>
            {
                resolve(new Response(readStream as unknown as ReadableStream, {
                    url: request.url,
                    status: 200,
                    statusText: 'OK',
                    size: fs.statSync(filePath).size,
                    timeout: (request as any).timeout,
                } as ResponseInit));
            });
        });
    },
    parseXML: (xml: string) =>
    {
        const parser = new DOMParser();

        return parser.parseFromString(xml, 'text/xml');
    },
} as unknown as Adapter;

DOMAdapter.set(NodeAdapter);
