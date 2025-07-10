import { registerFont } from 'canvas';
import { ExtensionType, getFontFamilyName, path } from 'pixi.js';

import type { LoaderParser, LoadFontData, ResolvedAsset } from 'pixi.js';

const validWeights = [
    'normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900',
];
const validFonts = ['.woff', '.woff2', '.ttf', '.otf'];

/** loads a font from a file */
export const loadNodeFont = {
    extension: ExtensionType.LoadParser,

    test(url: string): boolean
    {
        return validFonts.includes(path.extname(url).toLowerCase());
    },

    async load(url: string, options: ResolvedAsset<LoadFontData>): Promise<void>
    {
        const name = options.data?.family ?? getFontFamilyName(url);
        const weights = options.data?.weights?.filter((weight) => validWeights.includes(weight)) ?? ['normal'];
        const data = options.data ?? {} as LoadFontData;

        for (let i = 0; i < weights.length; i++)
        {
            const weight = weights[i];

            registerFont(url, {
                ...data,
                family: options.data?.family ?? name,
                weight,
            });
        }
    },
} as LoaderParser;
