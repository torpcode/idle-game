/**
 * Helps with loading and saving data to the player's machine.
 */
class StorageDevice {
    private saveKey: string;
    /**
     * List of bindings used to save data.
     */
    private bindings: {key: string; onSave: ()=>any;}[] = [];
    /**
     * Data loaded from the previous session; if any such data was found.
     */
    private loadedData: any;

    /**
     * Creates a new StorageDevice object.
     * @param saveKey A key with which data will be loaded and saved.
     */
    constructor(saveKey: string) {
        this.saveKey = saveKey;
        // Try to load previous session immediately
        this.tryLoad();
    }

    /**
     * Binds a component to the storage device.
     * The value of the component will be updated immediately, if loaded data is present for the specified key.
     * The value of the component will also be saved with the specified key whenever the 'save()' method of the
     * StorageDevice is called.
     */
    public bindCmp(key: string, cmp: Component): void {
        this.bind(key, (x => cmp.val = x), (() => cmp.val));
    }

    /**
     * Binds to the storage device.
     *
     * The 'onLoad' function will be invoked immediately, if the loaded data has a value for the specified key.
     * The resolved value will be passed as the function's parameter.
     *
     * The 'onSave' function will be invoked whenever the 'save()' method of the StorageDevice is called.
     * The return value of the function will be saved.
     */
    public bind(key: string, onLoad: (data: any)=>void, onSave: ()=>any) {
        // Load data immediately, if there is any
        const loadedData = this.loadedData;
        if (loadedData && loadedData.hasOwnProperty(key)) {
            onLoad(loadedData[key]);
        }

        this.bindings.push({key, onSave});
    }

    /**
     * Attempts to load data from the previous session.
     */
    private tryLoad(): void {
        const rawString: string = localStorage.getItem(this.saveKey);

        if (!rawString) {
            // No data matching the key found
            return;
        }

        let data: any;
        try {
            data = JSON.parse(rawString);
        } catch (ex) {
            // Data is not valid JSON (corrupt?)
            return;
        }

        // Data loaded successfully
        this.loadedData = data;
    }

    /**
     * Saves the current bindings of the StorageDevice to the player's machine.
     */
    public save(): void {
        const data: any = {};

        // Populate data object with bindings
        const bindings = this.bindings;
        for (let i = 0; i < bindings.length; i++) {
            const b = bindings[i];
            data[b.key] = b.onSave();
        }

        localStorage.setItem(this.saveKey, JSON.stringify(data));
    }
}