export default class Util {
    /**
     * Returns a random int between the min and max inclusive.
     * @param min
     * @param max
     * @returns
     */
    public static getRandomIntInclusive(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static chance(chance_percent: number): boolean {
        return Math.random() < chance_percent;
    }
}
