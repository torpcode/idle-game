/*class BoundComponent implements DisplayNode {
    // DisplayNode interface
    public isQueuedForRender: boolean;
    public nextQueued: DisplayNode;

    private _value: number;
    private _maximum: number;
    private progressBars: HTMLElement[];

    constructor() {
    }

    public get val(): number {
        return this._value;
    }

    public set val(value: number) {
        if (typeof value !== "number" || value < 0 || value === 1/0 || value !== value) {
            // Ensure the component's value remains a primitive, non-negative, finite number.
            value = 0;
        }

        // Ensure value does not exceed the maximum allowed
        const max = this._maximum;
        if (value > max) {
            value = max;
        }

        if (this._value === value) {
            // New value is same as old value, so do nothing.
            return;
        }

        // Set new value
        this._value = value;

        Display.queueForRender(this);
    }

    public get max(): number {
        return this._maximum;
    }

    public set max(maximum: number) {
        if (typeof maximum !== "number" || maximum < 0 || maximum === 1/0 || maximum !== maximum) {
            // Ensure the component's value remains a primitive, non-negative, finite number.
            maximum = 0;
        }

        if (this._maximum === maximum) {
            // New value is same as old value, so do nothing.
            return;
        }

        // Set new value
        this._maximum = maximum;

        // Ensure current value does not exceed the
        // new maximum, if it is smaller than the
        // previous maximum.
        if (maximum < this._value) {
            this._value = maximum;
        }

        Display.queueForRender(this);
    }

    public addProgressBar(progressBar: HTMLElement): void {
        this.progressBars.push(progressBar);
    }

    public render(): void {
        const progressBars = this.progressBars;
        if (progressBars.length > 0) {
            const percentageFull = (100*this._value/this._maximum) + "%";
            for (let i = 0; i < progressBars.length; i++) {
                progressBars[i].style.widows = percentageFull;
            }
        }
    }
}*/