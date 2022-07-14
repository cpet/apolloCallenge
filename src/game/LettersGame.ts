import { Application, Container, Graphics, Rectangle } from "pixi.js";
import Letter, { LetterTints } from "./Letter";
import LetterPool from "./LetterPool";
const Keyboard = require("pixi.js-keyboard");

export default class LettersGame {
    private _app: Application;
    private _gameWorld: Container;
    private _bgGraphics!: Graphics;
    private _pool: any;

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

        this.dev();
    }

    dev() {
        let letter = new Letter("A", this._gameWorld);
        letter.setXY(400, 400);

        let letter2 = new Letter("Z", this._gameWorld, LetterTints.gold);
        letter2.setXY(700, 300);

        // Build a pool of letters.
        const pool = LetterPool.getInstance();
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
        Keyboard.update();
    }

    onKeyPressed(key_str_code: any, event: any) {
        console.log("onKeyPressed: ", key_str_code, ", keyCode: " + event.keyCode);
    }
}

export const LOGICAL_GAME_SPACE = {
    width: 1080,
    height: 1080,
};
