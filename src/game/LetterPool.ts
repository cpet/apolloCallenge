import Letter from "./Letter";

export default class LetterPool {
    private _pool: Letter[] = [];
    private static _instance: LetterPool;

    private constructor() {}

    public static getInstance(): LetterPool {
        if (!LetterPool._instance) {
            LetterPool._instance = new LetterPool();
            LetterPool._instance.initPool();
        }

        return LetterPool._instance;
    }

    initPool() {
        for (let i = 0; i < 80; i++) {
            this._pool.push(new Letter("A"));
        }
    }

    pop(): Letter {
        if (this._pool.length > 0) {
            return this._pool.pop() as Letter;
        }

        return new Letter("A");
    }

    poolBack(letter: Letter) {
        this._pool.push(letter);
    }
}
