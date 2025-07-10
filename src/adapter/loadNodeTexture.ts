import { loadImage } from 'canvas';
import { ExtensionType, DOMAdapter, Texture, TextureSource, getResolutionOfUrl, path, createTexture } from 'pixi.js';
import { NodeCanvasElement } from './NodeCanvasElement';
import { NodeCanvasSource } from './NodeCanvasSource';

import type { LoaderParser, ResolvedAsset, TextureSourceOptions, Loader, LoadTextureConfig } from 'pixi.js';

const validImages = ['.jpg', '.png', '.jpeg', '.svg'];

/** loads our textures into a node canvas */
export const loadNodeTexture = {
    extension: ExtensionType.LoadParser,
    name: 'loadNodeTexture',

    test(url: string): boolean
    {
        return validImages.includes(path.extname(url).toLowerCase());
    },

    async load(url: string, asset: ResolvedAsset<TextureSourceOptions>, loader: Loader): Promise<Texture>
    {
        const data = await DOMAdapter.get().fetch(url);
        const image = await loadImage(Buffer.from(await data.arrayBuffer()));
        const canvas = new NodeCanvasElement(image.width, image.height);
        const ctx = canvas.getContext('2d');

        ctx?.drawImage(image as unknown as CanvasImageSource, 0, 0);
        const base = new NodeCanvasSource({
            resource: canvas as unknown as TextureSource,
            resolution: getResolutionOfUrl(url),
            ...asset.data
        });

        return createTexture(base, loader, url);
    },

    unload(texture: Texture): void
    {
        texture.destroy(true);
    }
} as LoaderParser<Texture, TextureSourceOptions, LoadTextureConfig>;
