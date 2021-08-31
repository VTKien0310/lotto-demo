export default class NumberHelper {
    /**
     * Check whether a number is an odd number
     *
     * @param number
     */
    static isOddNumber(number: number): boolean {
        return Boolean(number % 2)
    }

    /**
     * Get the ten part of a number
     *
     * @param number
     */
    static getNumberTen(number: number): number {
        return (number - (number % 10)) / 10
    }

    /**
     * Round a number up to the nearest even number
     *
     * @param number
     */
    static roundToEven(number: number): number {
        return this.isOddNumber(number) ? number + 1 : number
    }
}