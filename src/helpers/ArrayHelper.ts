export default class ArrayHelper {
    /**
     * Create a new zero-filled array with a chosen size
     *
     * @param size
     */
    static makeNewZeroFilledArray(size: number): Array<number> {
        return new Array<number>(size).fill(0)
    }

    /**
     * Check if a number is in a number array
     *
     * @param number
     * @param array
     */
    static numberIsInArray(number: number, array: Array<number>): boolean {
        return array.includes(number)
    }

    /**
     * Shuffle an array using the Fisher-Yates algorithm
     *
     * @param array
     */
    static shuffleArray(array: Array<any>): Array<any> {
        let currentIndex: number = array.length, randomIndex: number

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
        }

        return array
    }

    /**
     * Find and remove the first value found in an array
     *
     * @param target
     * @param array
     */
    static findFirstAndRemove(target: any, array: Array<any>): Array<any> {
        let targetIndex = array.indexOf(target)
        if (targetIndex > -1) {
            array.splice(targetIndex, 1)
        }
        return array
    }

    /**
     * Find the highest value in a number array
     *
     * @param array
     */
    static findMaxInNumberArray(array: Array<number>): number {
        return Math.max(...array)
    }

    /**
     * Check if all elements in an array are equal to each other
     *
     * @param array
     */
    static hasEqualElement(array: Array<any>): boolean {
        return array.every((element: any) => element === array[0])
    }
}