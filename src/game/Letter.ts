import { BitmapText, Container, Point } from "pixi.js";

/**
 * Class to encapsulate data and functionality needed for a game letter.
 */
export default class Letter {
    bt: BitmapText;

    private _tint!: number;

    private _isMatched: boolean = false;
    private _container!: Container;
    private _keyCode: string;

    //// Basic physics.
    vel: Point;
    acc: Point;

    constructor(letter: string, container?: Container, tint?: number) {
        this.bt = new BitmapText(letter, { fontName: "Cooper Black", fontSize: 180 });
        this.bt.visible = true;
        this.bt.interactive = false;
        this.bt.anchor.x = this.bt.anchor.y = 0.5;

        this._keyCode = "";
        this.letter = letter;

        if (container) this.addToContainer(container);

        this.tint = tint || LetterTints.regular;

        //// Physics.
        this.vel = new Point();
        this.acc = new Point();
    }

    update(dt: number) {}

    //// HELPERS

    addToContainer(container: Container) {
        this._container = container;
        this._container.addChild(this.bt);
    }

    //// IS?

    isRegular(): boolean {
        return this._tint === LetterTints.regular;
    }

    isGolden(): boolean {
        return this._tint === LetterTints.gold;
    }

    //// GET & SET.

    get letter(): string {
        return this.bt.text;
    }

    set letter(str: string) {
        this.bt.text = str;
        this._keyCode = "Key" + str;
    }

    get keyCode(): string {
        return this._keyCode;
    }

    get tint(): number {
        return this._tint;
    }

    set tint(v: number) {
        this._tint = v;
        this.bt.tint = this._tint;
    }

    setXY(x: number, y: number) {
        if (!this.bt) return;

        this.bt.x = x;
        this.bt.y = y;

        return this;
    }

    reset() {}
}

// export enum LetterTypes {
//     regular,
//     gold
// }

export const LetterTints = {
    regular: 0x141a52,
    gold: 0xd9aa11,
};
