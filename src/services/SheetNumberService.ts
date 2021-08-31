import ArrayHelper from "@/helpers/ArrayHelper";
import NumberHelper from "@/helpers/NumberHelper";

export default class SheetNumberService {
    /**
     * Get the column that a number belongs to from 0-8
     *
     * @param number
     * @private
     */
    static getNumberColumn(number: number): number {
        let column: number = NumberHelper.getNumberTen(number)
        return column > 8 ? 8 : column
    }

    /**
     * Get the numbers that can be placed in a column from 0-8 (1-9 in reality)
     *
     * @param columnNumber
     * @private
     */
    static getNumbersForColumn(columnNumber: number): Array<number> {
        if (columnNumber < 0 || columnNumber > 8) {
            throw new Error('Invalid column number.')
        }

        let numbers: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num: number) => num + columnNumber * 10)

        // prepend 10, 20, 30, 40, 50, 60, 70, 80 if column is not 0
        if (columnNumber != 0) {
            numbers.unshift(columnNumber * 10)
        }
        if (columnNumber == 8) {
            numbers.push(90)
        }
        return numbers
    }

    /**
     * Get an array of numbers from 1-90
     */
    static getNumbersForSheet(): Array<number> {
        let numbers: Array<number> = []
        for (let i = 0; i <= 8; i++) {
            numbers.push(...SheetNumberService.getNumbersForColumn(i))
        }
        return numbers
    }

    /**
     * Init a priority memory array
     *
     * @param numbers
     * @private
     */
    private initPriorityMemory(numbers: Array<number>): Array<number> {
        let priorityMemory: Array<number> = ArrayHelper.makeNewZeroFilledArray(9)
        numbers.forEach((num: number) => priorityMemory[SheetNumberService.getNumberColumn(num)]++)
        return priorityMemory
    }

    /**
     * Generate numbers for 2 sibling sheets
     */
    generateSheetNumbers(): { sheetOne: Array<number>, sheetTwo: Array<number> } {
        let sheetOneNumbers: Array<number> = [],
            sheetTwoNumbers: Array<number> = [],
            sheetNumbers: Array<number> = ArrayHelper.shuffleArray(SheetNumberService.getNumbersForSheet()),
            priorityMemory: Array<number> = this.initPriorityMemory(sheetNumbers)

        // add new numbers by priority to sheet 1 and the remaining numbers to sheet 2
        while (sheetOneNumbers.length < 45) {
            // only choose numbers from higher priority columns
            let highPriorityNumber = this.getHighPriorityNumbers(sheetNumbers, priorityMemory),
                newNumber: number = ArrayHelper.shuffleArray(highPriorityNumber)[0]
            sheetOneNumbers.push(newNumber)
            this.priorityAndSelectableManagement(newNumber, sheetNumbers, priorityMemory)
        }
        sheetTwoNumbers.push(...sheetNumbers)

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
            priorityMemory: Array<number> = this.initPriorityMemory(sheet)

        sheet = ArrayHelper.shuffleArray(sheet)

        while (arrangedSheet.length < 45) {
            arrangedSheet.push(...this.makeRowData(sheet, priorityMemory))
        }

        return arrangedSheet
    }

    /**
     * Get high priority numbers from a selection pool
     *
     * @param selectionPool
     * @param priorityMemory
     * @private
     */
    private getHighPriorityNumbers(selectionPool: Array<number>, priorityMemory: Array<number>) {
        return this.rejectNumbersFromColumns(
            selectionPool,
            this.getLowPriorityColumns(priorityMemory)
        )
    }

    /**
     * Update the priorities of columns and the selectable numbers pool
     *
     * @param newNumber
     * @param selectionPool
     * @param priorityMemory
     * @private
     */
    private priorityAndSelectableManagement(newNumber: number, selectionPool: Array<number>, priorityMemory: Array<number>) {
        priorityMemory[SheetNumberService.getNumberColumn(newNumber)] -= 1
        ArrayHelper.findFirstAndRemove(newNumber, selectionPool)
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
            let highPriorityNumbers = this.getHighPriorityNumbers(sheetNumbers, priorityMemory),
                newNumber = this.findNewNumberForRow(highPriorityNumbers, newRow)

            if (newNumber != -1) {
                newRow.push(newNumber)
                this.priorityAndSelectableManagement(newNumber, sheetNumbers, priorityMemory)
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
            if (priorityMemory[i] < highestPriority) {
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