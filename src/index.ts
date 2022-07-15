import { Application, Loader } from "pixi.js";
import LettersGame from "./game/LettersGame";
import "./style.css";

const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const app = new Application({
    backgroundColor: 0xd3d3d3,
    width: gameWidth,
    height: gameHeight,
});

let game: LettersGame;

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);
    enableResizeListener();

    await loadGameAssets();

    app.stage.interactive = true;

    game = new LettersGame(app);
    game.resize(app.screen.width, app.screen.height);
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;
        loader.add("Cooper Black", "./assets/fonts/letters_ss.fnt");

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function enableResizeListener(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        if (game) game.resize(window.innerWidth, window.innerHeight);
    };

    resize();

    window.addEventListener("resize", resize);
}
