import { BitmapText, Container } from "pixi.js";

export default class PointsMenu extends Container {
    bt: BitmapText;
    startBt: BitmapText;

    private _pointsTemplate: string;

    constructor() {
        super();

        this._pointsTemplate =
            "BLUE LETTERS: [ph_num_points]\n" +
            "GOLD LETTERS: [ph_num_gold_points]\n" +
            "TOTAL SCORE: BLUE LETTERS + (GOLD LETTERS * 2)";
        ("TOTAL SCORE: [ph_total_points]");

        this.bt = new BitmapText("");

        this.startBt = new BitmapText("( CLICK TO PLAY AGAIN )", {
            fontName: "ETH_B_gofa",
            fontSize: 180,
            align: "center",
        });
        this.startBt.interactive = true;
        this.startBt.buttonMode = true;

        this.startBt.on("pointerdown", this._onStartClick);

        this.addChild(this.bt);
        this.addChild(this.startBt);
    }

    private _onStartClick() {
        this.emit(POINTS_MENU_EVENTS.startPointerDown);
    }
}

export const POINTS_MENU_EVENTS = {
    startPointerDown: "pointsstartpointerdown",
};
