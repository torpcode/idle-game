class LoadedData {
    // The actual object representing loaded data
    private dataObj: any;

    constructor(dataObj: any) {
        this.dataObj = dataObj;
    }

    public readCmp(key: string, cmp: Component): void {
        const dataObj = this.dataObj;
        if (dataObj.hasOwnProperty(key)) {
            const data = dataObj[key];
            // todo: typeof data === "number"?
            if (data !== undefined && data !== null) {
                cmp.val = data;
            }
        }
    }

    public read(key: string, ref: (data: any)=>void): void {
        const dataObj = this.dataObj;
        if (dataObj.hasOwnProperty(key)) {
            const data = dataObj[key];
            if (data !== undefined && data !== null) {
                ref(data);
            }
        }
    }

    public static load(key: string): LoadedData {
        let data: any = localStorage.getItem(key);

        if (!data) {
            // No saved data found
            return null;
        }

        try {
            data = JSON.parse(data);
        } catch (ex) {
            // Bad or corrupt data
            Assert.fail("Bad save data.");
            return null;
        }

        return new LoadedData(data);
    }
}