export default class RandomNumberService {
    /**
     * Generate a random number within the range of min-max inclusively
     *
     * @param min
     * @param max
     */
    generateRandomNumberInRange(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    /**
     * Generate an array of random and unique numbers
     *
     * @param size
     * @param min
     * @param max
     */
    generateRandomUniqueArrayInRange(size: number, min: number, max: number) {
        let numbers: Array<number> = []

        while (numbers.length < size) {
            let randomNumber: number = this.generateRandomNumberInRange(min, max)
            if (numbers.indexOf(randomNumber) === -1) {
                numbers.push(randomNumber)
            }
        }

        return numbers
    }

    /**
     * Generate 45 numbers for a sheet
     */
    generateSheetNumbers(): Array<number> {
        return this.generateRandomUniqueArrayInRange(45, 1, 90)
    }

    /**
     * Generate a random numbers arrangement for a row
     */
    getArrangement(): Array<number> {
        return this.generateRandomUniqueArrayInRange(5, 0, 8)
    }

    /**
     * Get the numbers of a row of a sheet
     *
     * @param rowNumber
     * @param numbers
     */
    getRow(rowNumber: number, numbers: Array<number>): Array<number> {
        let row: Array<number> = [],
            startIndex: number = (--rowNumber) * 5,
            endIndex: number = startIndex + 5

        for (let i = startIndex; i < endIndex; i++) {
            row.push(numbers[i])
        }

        return row
    }

    /**
     * Get the data to render to the UI of a row
     *
     * @param rowNumber
     * @param numbers
     */
    getRowRenderData(rowNumber: number, numbers: Array<number>) {
        let row: Array<number> = this.getRow(rowNumber, numbers),
            arrangement: Array<number> = this.getArrangement(),
            renderData: Array<number> = new Array<number>(9).fill(0)

        for (let i = 0; i < row.length; i++) {
            renderData[arrangement[i]] = row[i]
        }

        return renderData
    }
}