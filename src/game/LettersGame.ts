import { Application, Container, Graphics, Rectangle } from "pixi.js";
import Letter, { LetterTints } from "./Letter";
import LetterPool from "./LetterPool";
const Keyboard = require("pixi.js-keyboard");

export default class LettersGame {
    private _app: Application;
    private _gameWorld: Container;
    private _bgGraphics!: Graphics;
    private _pool: any;
    /**
     * Letters in play.
     */
    private _letters: Letter[];

    constructor(app: Application) {
        this._app = app;
        this._gameWorld = new Container();
        this._app.stage.addChild(this._gameWorld);

        // Game world background.
        this._bgGraphics = new Graphics();
        this._bgGraphics.beginFill(0xd9eefa);
        this._bgGraphics.drawRect(0, 0, LOGICAL_GAME_SPACE.width, LOGICAL_GAME_SPACE.height);
        this._bgGraphics.endFill();
        this._gameWorld.addChild(this._bgGraphics);

        // Register keyboard events.
        Keyboard.events.on("pressed", null, this.onKeyPressed);

        // Init the pool of letters.
        this._pool = LetterPool.getInstance();
        this._letters = [];
        this.dev();
    }

    dev() {
        for (let i = 0; i < 10; i++) {
            const letter: Letter = this._pool.pop();
            letter.setXY(100 + 100 * i, 100 + 80 * i);
            letter.addToContainer(this._gameWorld);
            letter.letter = this._getRandomLetter();

            letter.setVelAndAcc(0, 0, 0, 0.02);
            letter.angularMomentum = 15 / Math.PI / 180;

            // Add the letter to the array of active (in use) letters.
            this._letters.push(letter);
        }
    }

    showStartMenu() {}

    startGame() {
        // Add the game update to the PIXI app ticker.
        this._app.ticker.add((delta) => this.update(delta));
    }

    /**
     * Fit the logical game space into the new width and height.
     * The fitting strategy is to fit the game by desired height then center the game world into the available space.
     * @param new_width
     * @param new_height
     */
    resize(new_width: number, new_height: number) {
        const scale: number = new_height / LOGICAL_GAME_SPACE.height;
        this._gameWorld.scale.x = this._gameWorld.scale.y = scale;

        const new_game_width = LOGICAL_GAME_SPACE.width * scale;
        if (new_game_width < new_width) {
            this._gameWorld.x = (new_width - new_game_width) * 0.5;
        }
    }

    update(delta: number) {
        // Update all letters in play.
        this._letters.forEach((letter: Letter, index: number) => {
            letter.update(delta);
        });
        Keyboard.update();
    }

    onKeyPressed(key_str_code: any, event: any) {
        console.log("onKeyPressed: ", key_str_code, ", keyCode: " + event.keyCode);
    }

    checkLettersForKey(key_str_code: string) {}

    //// HELPERS.

    private _getRandomLetter(): string {
        return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
}

export const LOGICAL_GAME_SPACE = {
    width: 1080,
    height: 1080,
};

export const ALPHABET = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];
