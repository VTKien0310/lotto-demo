import SheetNumberService from "@/services/SheetNumberService";

let serviceContainer = {
    sheetNumberService(): SheetNumberService {
        return new SheetNumberService()
    }
}

export default serviceContainer