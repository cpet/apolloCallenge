import { BitmapText, Container, Point } from "pixi.js";
import { gsap } from "gsap";
import { LOGICAL_GAME_SPACE } from "./LettersGame";

/**
 * Class to encapsulate data and functionality needed for a game letter.
 */
export default class Letter {
    bt: BitmapText;
    points: number = 1;

    private _tint!: number;

    private _container!: Container | null | undefined;
    private _keyCode: string;

    //// Basic physics.
    vel: Point;
    acc: Point;
    angularMomentum: number = 0;

    constructor(letter: string, container?: Container, tint?: number) {
        this.bt = new BitmapText(letter, { fontName: "Cooper Black", fontSize: 180 });
        this.bt.visible = true;
        this.bt.interactive = false;
        this.bt.anchor.x = this.bt.anchor.y = 0.5;

        this._keyCode = "";
        this.letter = letter;

        if (container) this.addToContainer(container);

        this.tint = tint || LetterTints.normal;

        //// Physics.
        this.vel = new Point();
        this.acc = new Point();
    }

    update(dt: number) {
        this.bt.x += this.vel.x * dt;
        this.bt.y += this.vel.y * dt;

        this.vel.x += this.acc.x * dt;
        this.vel.y += this.acc.y * dt;

        this.bt.rotation += this.angularMomentum * dt;

        if (this.bt.x < LOGICAL_GAME_SPACE.leftBound) {
            this.bt.x = LOGICAL_GAME_SPACE.leftBound;
            this.vel.x = Math.abs(this.vel.x);
        } else if (this.bt.x > LOGICAL_GAME_SPACE.rightBound) {
            this.bt.x = LOGICAL_GAME_SPACE.rightBound;
            this.vel.x = -Math.abs(this.vel.x);
        }
    }

    doMatchedAnimation() {
        this.setVelAndAcc();
        this.bt.alpha = 1;
        this.bt.scale.x = this.bt.scale.y = 1;
        gsap.to(this.bt, {
            duration: 1,
            alpha: 0.01,
            onComplete: this.reset.bind(this),
        });
        gsap.to(this.bt.scale, {
            duration: 1,
            x: 1.5,
            y: 1.5,
        });
    }

    //// HELPERS.

    addToContainer(container: Container) {
        this._container = container;
        this._container.addChild(this.bt);
    }

    removeFromParent() {
        if (this._container) {
            this._container.removeChild(this.bt);
            return;
        }

        this._container = null;
    }

    reset() {
        // Sets vel and acc to 0.
        this.setVelAndAcc();

        this.bt.rotation = 0;
        this.bt.alpha = 1;
        this.bt.scale.x = this.bt.scale.y = 1;
        this.bt.visible = true;

        this.points = 1;
        this.tint = LetterTints.normal;
        this.removeFromParent();

        gsap.killTweensOf(this.bt);
        gsap.killTweensOf(this.bt.scale);
    }

    hide() {
        this.bt.visible = false;
    }

    //// IS?

    isRegular(): boolean {
        return this._tint === LetterTints.normal;
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

    getType(): LetterTypes {
        return this._tint == LetterTints.normal ? LetterTypes.normal : LetterTypes.gold;
    }

    setXY(x: number, y: number) {
        if (!this.bt) return;

        this.bt.x = x;
        this.bt.y = y;

        return this;
    }

    setVelAndAcc(vel_x = 0, vel_y = 0, acc_x = 0, acc_y = 0) {
        this.vel.x = vel_x;
        this.vel.y = vel_y;

        this.acc.x = acc_x;
        this.acc.y = acc_y;
    }
}

export enum LetterTypes {
    normal,
    gold,
}

export const LetterTints = {
    normal: 0x202fba,
    gold: 0xd9aa11,
};
