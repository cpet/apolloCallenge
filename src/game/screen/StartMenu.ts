import { BitmapText, Container } from "pixi.js";
import { LOGICAL_GAME_SPACE } from "../LettersGame";

export default class StartMenu extends Container {
    startBtn: BitmapText;

    constructor() {
        super();

        this.startBtn = new BitmapText("( START )", {
            fontName: "ETH_B_gofa",
            fontSize: 120,
            align: "center",
        });
        this.startBtn.interactive = true;
        this.startBtn.buttonMode = true;

        this.startBtn.x = LOGICAL_GAME_SPACE.halfWidth;
        this.startBtn.y = LOGICAL_GAME_SPACE.halfHeight;
        this.startBtn.anchor.x = this.startBtn.anchor.y = 0.5;

        this.addChild(this.startBtn);
    }

    resize(new_width: number, new_height: number) {
        const scale: number = new_height / LOGICAL_GAME_SPACE.height;
        this.scale.x = this.scale.y = scale;

        const new_game_width = LOGICAL_GAME_SPACE.width * scale;
        if (new_game_width < new_width) {
            this.x = (new_width - new_game_width) * 0.5;
        }
    }
}
