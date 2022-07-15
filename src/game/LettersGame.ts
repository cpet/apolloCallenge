import { Application, Container, Graphics, Rectangle } from "pixi.js";
import Util from "../Util";
import Letter, { LetterTints, LetterTypes } from "./Letter";
import LetterPool from "./LetterPool";
const Keyboard = require("pixi.js-keyboard");
import { gsap } from "gsap";
import StartMenu, { START_MENU_EVENTS } from "./screen/StartMenu";
import PointsMenu, { POINTS_MENU_EVENTS } from "./screen/PointsMenu";

export default class LettersGame {
    private _app: Application;
    private _gameWorld: Container;

    private _startMenu: StartMenu;
    private _pointsMenu: PointsMenu;

    private _bgGraphics!: Graphics;
    private _pool: LetterPool;
    /**
     * Letters in play.
     */
    private _letters: Letter[];

    private _normalPoints: number = 0;
    private _goldenPoints: number = 0;
    /**
     * Penalty for wrong keys. Anty-keyboard mashing.
     */
    private _wrongPoints: number = 0;

    /**
     * Spawn every time in seconds.
     */
    private _spawnEvery: number = 1.25;
    private _spawnNumLetters: number = 2;

    /**
     * Max wave per session;
     */
    private _numWaves: number = 16;
    /**
     * Current wave.
     */
    private _currentWaveNum: number = 0;

    /**
     * Tracks letters that need to be removed from the game. Internal use.
     */
    private _toBeRemoved: Letter[] = [];

    private _gameIsRunning: boolean = false;

    constructor(app: Application) {
        this._app = app;
        this._gameWorld = new Container();
        this.initStartMenu();

        this._app.stage.addChild(this._gameWorld);

        // Game world background.
        this._bgGraphics = new Graphics();
        this._bgGraphics.beginFill(0xd9eefa);
        this._bgGraphics.drawRect(0, 0, LOGICAL_GAME_SPACE.width, LOGICAL_GAME_SPACE.height);
        this._bgGraphics.endFill();
        this._gameWorld.addChild(this._bgGraphics);

        // Register keyboard events.
        Keyboard.events.on("pressed", null, this.onKeyPressed.bind(this));

        // Init the pool of letters.
        this._pool = LetterPool.getInstance();
        this._letters = [];
        this.dev();
    }

    dev() {
        // this.startGame();
        this.showStartMenu();
    }

    startGame() {
        // Add the game update to the PIXI app ticker.
        this._app.ticker.add((delta) => this.update(delta));

        // Start the letter wave spawner.
        this.spawnLetterWave();
        this._gameIsRunning = true;

        this._app.stage.addChild(this._gameWorld);
        this._gameWorld.visible = true;

        this._app.stage.removeChild(this._startMenu);
        this._startMenu.visible = false;
    }

    stopGame() {
        this.clearLetters();
    }

    spawnLetterWave() {
        let spawn_x: number = 0;
        let spawn_y: number = -50;

        for (let i = 0; i < this._spawnNumLetters; i++) {
            spawn_x = Util.getRandomIntInclusive(LOGICAL_GAME_SPACE.leftBound, LOGICAL_GAME_SPACE.rightBound);

            const letter: Letter = this._pool.pop();
            letter.reset();
            letter.setXY(spawn_x, spawn_y);
            letter.addToContainer(this._gameWorld);
            letter.letter = this._getRandomLetter();

            // 25% chance to be a golden letter.
            letter.tint = Util.chance(0.25) ? LetterTints.gold : LetterTints.normal;

            let vel_x = 0;
            let vel_y = 0.5;
            if (spawn_x < LOGICAL_GAME_SPACE.halfWidth) {
                vel_x = Util.getRandomIntInclusive(0, 2);
            } else {
                vel_x = Util.getRandomIntInclusive(-2, 0);
            }

            let sign: number = Util.chance(0.5) ? 1 : -1;
            let acc_y: number = 0.025;
            if (letter.isGolden()) {
                letter.angularMomentum = (sign * Util.getRandomIntInclusive(15, 30)) / Math.PI / 180;
                vel_y = 1;
                acc_y = 0.05;
            } else {
                letter.angularMomentum = (sign * Util.getRandomIntInclusive(0, 15)) / Math.PI / 180;
            }

            letter.setVelAndAcc(vel_x, vel_y, 0, acc_y);

            // Add the letter to the array of active (in use) letters.
            this._letters.push(letter);
        }
        // Check if we need to spawn more letters.
        if (this._currentWaveNum < this._numWaves && this._gameIsRunning) {
            this._currentWaveNum++;
            gsap.delayedCall(this._spawnEvery, () => {
                this.spawnLetterWave();
            });
        } else {
            // TODO: show points.
        }
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

        this._startMenu.resize(new_width, new_height);
    }

    update(delta: number) {
        // Update all letters in play.
        this._letters.forEach((letter: Letter, index: number) => {
            letter.update(delta);
            if (letter.bt.y > LOGICAL_GAME_SPACE.bottomBound) {
                this._toBeRemoved.push(letter);
            }
        });
        Keyboard.update();

        this._toBeRemoved.forEach((letter) => {
            this.removeLetter(letter);
            letter.hide();
            this._pool.poolBack(letter);
        });

        while (this._toBeRemoved.length > 0) {
            this._toBeRemoved.pop();
        }
    }

    onKeyPressed(key_str_code: any, event: any) {
        console.log("onKeyPressed: ", key_str_code, ", keyCode: " + event.keyCode);
        this.checkLetterKey(key_str_code);
    }

    /**
     * Checks for existence of at least one game letter that matches the given string code and removes it.
     * This method removes (only) the first found matching element.
     * @param key_str_code the string representation of the key code to check for.
     */
    checkLetterKey(key_str_code: string) {
        for (let i = 0; i < this._letters.length; i++) {
            const letter = this._letters[i];
            if (letter.keyCode == key_str_code) {
                this.onLetterMatched(letter);
                this.removeLetter(letter, i);
                this._pool.poolBack(letter);
                return;
            }
        }

        console.log("checkLetterKey: ", key_str_code, ", was not found in the active game letters.");
        this._wrongPoints += 3;
    }

    /**
     * Removes a letter from the game. Optionally the index can be passed in otherwise this._letters.indexOf will be used instead.
     * @param letter
     * @param index
     */
    removeLetter(letter: Letter, index?: number) {
        if (index == undefined || index == null) {
            index = this._letters.indexOf(letter);
        }

        this._letters.splice(index, 1);
    }

    /**
     * Starts the letter matched animation and awards points based on the given letter type.
     * @param letter
     */
    onLetterMatched(letter: Letter) {
        letter.doMatchedAnimation();
        if (letter.getType() == LetterTypes.normal) {
            this._normalPoints += letter.points;
            console.log("Scored Normal Points: ", letter.points, ", normal points: ", this._normalPoints);
        } else {
            this._goldenPoints += letter.points * 2;
            console.log("Scored Golden Points: ", letter.points * 2, ", golden points: ", this._goldenPoints);
        }
    }

    clearLetters() {
        this._letters.forEach((letter) => {
            letter.reset();
            this._pool.poolBack(letter);
        });

        this._letters = [];
    }

    reset() {
        this._normalPoints = 0;
        this._goldenPoints = 0;

        this._gameIsRunning = false;
    }

    //// MENUS.

    initStartMenu() {
        this._startMenu = new StartMenu();
        this._startMenu.startBtn.on("pointerdown", () => {
            this.startGame();
            this._startMenu.visible = false;
        });
    }

    showStartMenu() {
        this._gameWorld.visible = false;
        this._startMenu.visible = true;
        this._app.stage.addChild(this._startMenu);
        this._app.stage.removeChild(this._gameWorld);
    }

    showPointsMenu() {}

    //// HELPERS.

    private _getRandomLetter(): string {
        return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
}

export const LOGICAL_GAME_SPACE = {
    width: 1080,
    height: 1080,
    leftBound: 100,
    rightBound: 1080 - 100 * 2,
    bottomBound: 1080 + 50,
    halfWidth: 1080 / 2,
    halfHeight: 1080 / 2,
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
