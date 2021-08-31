import ArrayHelper from "@/helpers/ArrayHelper";
import NumberHelper from "@/helpers/NumberHelper";

export default class SheetNumberService {
    /**
     * Get the column that a number belongs to
     *
     * @param number
     * @private
     */
    static getNumberColumn(number: number): number {
        return NumberHelper.getNumberTen(number - 1)
    }

    /**
     * Get the numbers that can be placed in a column
     *
     * @param columnNumber
     * @private
     */
    static getNumbersForColumn(columnNumber: number): Array<number> {
        let row: Array<number> = [],
            startNumber: number = (columnNumber - 1) * 10 + 1,
            endNumber: number = startNumber + 9

        for (let i = startNumber; i <= endNumber; i++) {
            row.push(i)
        }

        return row
    }

    /**
     * Generate the numbers for a column of two sheets
     *
     * @param column
     */
    generateNumbersForColumns(column: number): { firstSheetColumn: Array<number>, secondSheetColumn: Array<number> } {
        let rowNumbers: Array<number> = ArrayHelper.shuffleArray(SheetNumberService.getNumbersForColumn(column)),
            firstHalf: Array<number>,
            secondHalf: Array<number>;

        ({firstHalf, secondHalf} = ArrayHelper.splitArrayToTwo(rowNumbers))

        return {
            firstSheetColumn: firstHalf,
            secondSheetColumn: secondHalf
        }
    }

    /**
     * Generate numbers for 2 sibling sheets
     */
    generateSheetNumbers(): { sheetOne: Array<number>, sheetTwo: Array<number> } {
        let sheetOneNumbers: Array<number> = [],
            sheetTwoNumbers: Array<number> = [],
            firstSheetColumn: Array<number> = [],
            secondSheetColumn: Array<number> = []

        for (let i = 1; i <= 9; i++) {
            ({firstSheetColumn, secondSheetColumn} = this.generateNumbersForColumns(i))
            sheetOneNumbers.push(...firstSheetColumn)
            sheetTwoNumbers.push(...secondSheetColumn)
        }

        return {
            sheetOne: this.arrangeSheetNumber(sheetOneNumbers),
            sheetTwo: this.arrangeSheetNumber(sheetTwoNumbers)
        }
    }

    /**
     * Arrange the numbers formation of a sheet
     *
     * @param sheet
     * @private
     */
    private arrangeSheetNumber(sheet: Array<number>): Array<number> {
        let arrangedSheet: Array<number> = [],
            priorityMemory: Array<number> = ArrayHelper.makeNewFilledArray(9, 5)

        sheet = ArrayHelper.shuffleArray(sheet)

        while (arrangedSheet.length < 45) {
            arrangedSheet.push(...this.makeRowData(sheet, priorityMemory))
        }

        return arrangedSheet
    }

    /**
     * Make a new row for a sheet
     *
     * @param sheetNumbers
     * @param priorityMemory
     * @private
     */
    private makeRowData(sheetNumbers: Array<number>, priorityMemory: Array<number>): Array<number> {
        let newRow: Array<number> = []
        while (newRow.length < 5) {
            // only choose numbers from higher priority columns
            let highPriorityNumber = this.rejectNumbersFromColumns(
                    sheetNumbers,
                    this.getLowPriorityColumns(priorityMemory)
                ),
                newNumber = this.findNewNumberForRow(highPriorityNumber, newRow)

            if (newNumber != -1) {
                newRow.push(newNumber)

                // update the priorities of columns and the selectable numbers pool
                priorityMemory[SheetNumberService.getNumberColumn(newNumber)] -= 1
                ArrayHelper.findFirstAndRemove(newNumber, sheetNumbers)
            } else {
                throw new Error('No suitable number found to construct a new row.')
            }
        }
        return newRow
    }

    /**
     * Find a new number to add to a row, return -1 if found none
     *
     * @param selectionPool
     * @param rowData
     * @private
     */
    private findNewNumberForRow(selectionPool: Array<number>, rowData: Array<number>): number {
        for (let i = 0; i < selectionPool.length; i++) {
            // return the new number if the number's column is not occupied
            if (!this.rowColumnIsOccupied(rowData, SheetNumberService.getNumberColumn(selectionPool[i]))) {
                return selectionPool[i]
            }
        }
        return -1
    }

    /**
     * Get the columns that have more numbers picked out than the others
     *
     * @param priorityMemory
     * @private
     */
    private getLowPriorityColumns(priorityMemory: Array<number>): Array<number> {
        if (ArrayHelper.hasEqualElement(priorityMemory)) {
            return []
        }

        let highestPriority: number = ArrayHelper.findMaxInNumberArray(priorityMemory),
            lowPriorityColumn: Array<number> = []
        for (let i = 0; i < priorityMemory.length; i++) {
            if (priorityMemory[i] != highestPriority) {
                lowPriorityColumn.push(i)
            }
        }
        return lowPriorityColumn
    }

    /**
     * Remove from the input numbers the ones that can be placed in one of the input columns
     *
     * @param numbers
     * @param columns
     * @private
     */
    private rejectNumbersFromColumns(numbers: Array<number>, columns: Array<number>): Array<number> {
        return numbers.filter((number: number) => !ArrayHelper.numberIsInArray(
            SheetNumberService.getNumberColumn(number),
            columns
        ))
    }

    /**
     * Check if a column of a row is occupied
     *
     * @param row
     * @param column
     * @private
     */
    private rowColumnIsOccupied(row: Array<number>, column: number): boolean {
        let occupiedColumn = row.map((num: number) => SheetNumberService.getNumberColumn(num))
        return ArrayHelper.numberIsInArray(column, occupiedColumn)
    }

    /**
     * Get the numbers of a row of a sheet
     *
     * @param rowNumber
     * @param numbers
     */
    getRow(rowNumber: number, numbers: Array<number>): Array<number> {
        let row: Array<number> = [],
            startIndex: number = (rowNumber - 1) * 5,
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
        return this.getArrangement(this.getRow(rowNumber, numbers))
    }

    /**
     * Arrange a row's numbers according to the numbers' columns
     */
    getArrangement(rowNumbers: Array<number>): Array<number> {
        let arrangement = ArrayHelper.makeNewZeroFilledArray(9)
        rowNumbers.forEach((num: number) => arrangement[SheetNumberService.getNumberColumn(num)] = num)
        return arrangement
    }
}