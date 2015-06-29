class SaveTarget {
    private dataObj: any = {};
    private saved: boolean = false;

    public write(key: string, data: any): void {
        if (this.saved) {
            Assert.fail("The specified SaveTarget object has already been saved.");
            return;
        }
        const dataObj = this.dataObj;
        if (dataObj.hasOwnProperty(key)) {
            throw new Error("Target object already has data for the following key.");
        }
        dataObj[key] = data;
    }

    public save(key: string): void {
        if (this.saved) {
            Assert.fail("The specified SaveTarget object has already been saved.");
            return;
        }
        this.saved = true;

        localStorage.setItem(key, JSON.stringify(this.dataObj));
    }
}