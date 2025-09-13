import { Image } from 'canvas';
import { type ImageLike } from 'pixi.js';

export class NodeImage extends EventTarget implements ImageLike
{
    // I want to make it private but it is referred to in NodeCanvasElement.
    _image: Image;

    private _decodeResolves: (() => void)[] = [];
    private _decodeRejects: ((err: Error) => void)[] = [];

    // ignored
    crossOrigin: string | null = null;

    onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    onerror: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;

    constructor()
    {
        super();
        this._image = new Image();
        this._image.onload = () =>
        {
            this.onload?.call(this as unknown as GlobalEventHandlers, new Event('load'));
            this._decodeResolves.forEach((resolve) => resolve());
            this._decodeResolves.length = 0;
        };
        this._image.onerror = (err: Error) =>
        {
            this.onerror?.call(this as unknown as GlobalEventHandlers, new Event('error'));
            this._decodeRejects.forEach((reject) => reject(err));
            this._decodeRejects.length = 0;
        };
    }

    get src(): string
    {
        return this._image.src as string;
    }

    set src(value: string)
    {
        this._image.src = value;
    }

    get width(): number
    {
        return this._image.width;
    }

    set width(value: number)
    {
        this._image.width = value;
    }

    get height(): number
    {
        return this._image.height;
    }

    set height(value: number)
    {
        this._image.height = value;
    }

    get complete(): boolean
    {
        return this._image.complete;
    }

    decode(): Promise<void>
    {
        if (this._image.complete)
        {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) =>
        {
            this._decodeResolves.push(resolve);
            this._decodeRejects.push(reject);
        });
    }

    get currentSrc(): string
    {
        return this._image.src as string;
    }

    remove(): void
    {
        // noop
    }
}
