import { BitmapText, Container } from "pixi.js";
import { LOGICAL_GAME_SPACE } from "../LettersGame";

export default class PointsMenu extends Container {
    bt: BitmapText;
    startBtn: BitmapText;

    private _pointsTemplate: string;

    constructor() {
        super();

        this._pointsTemplate =
            "BLUE LETTERS: [ph_num_points]\n" +
            "GOLD LETTERS: [ph_num_gold_points]\n" +
            "FAULTS: [ph_num_faults]\n\n" +
            "TOTAL SCORE:\n" +
            "BLUE LETTERS\n+( GOLD LETTERS X 2 )\n-( FAULTS X 3 )\n\n" +
            "TOTAL SCORE: [ph_total_points]";

        this.bt = new BitmapText(this._pointsTemplate, {
            fontName: "ETH_B_gofa",
            fontSize: 72,
            align: "left",
        });

        this.startBtn = new BitmapText("( PLAY AGAIN )", {
            fontName: "ETH_B_gofa",
            fontSize: 120,
            align: "center",
        });

        this.startBtn.interactive = true;
        this.startBtn.buttonMode = true;
        this.startBtn.x = LOGICAL_GAME_SPACE.halfWidth;
        this.startBtn.y = LOGICAL_GAME_SPACE.halfHeight + 340;
        this.startBtn.anchor.x = this.startBtn.anchor.y = 0.5;

        this.bt.y = 100;

        this.addChild(this.bt);
        this.addChild(this.startBtn);
    }

    updatePoints(normal_points: number, golden_points: number, fault_points: number) {
        const total_points: number = normal_points + 2 * golden_points - fault_points * 3;

        // Modify the copy.
        let str = this._pointsTemplate.replace("[ph_num_points]", "" + normal_points);
        let str2 = str.replace("[ph_num_gold_points]", "" + golden_points);
        let str3 = str2.replace("[ph_num_faults]", "" + fault_points);
        let str4 = str3.replace("[ph_total_points]", "" + total_points);
        this.bt.text = str4;
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
