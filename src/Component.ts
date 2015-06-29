class Component implements DisplayNode {
    // DisplayNode interface
    public isQueuedForRender: boolean;
    public nextQueued: DisplayNode;

    private _value: number;
    private filter: (value: number)=>number;
    private controls: Control[] = [];
    private format: (value: number)=>any;
    private valueAsText: string;
    private styleClass: string;

    // The largest value ever reached by the component.
    private maxValueReached: number = -1/0;
    // Array of listeners awaiting for a specific maximum-value to be reached.
    private maxValueListeners: {value: number; listener: ()=>void;}[];

    constructor(value: number = 0, format?: (value: number)=>any, filter?: (value: number)=>number, styleClass?: string) {
        // 1. value
        if (typeof value === "number") {
            this._value = value;
        } else {
            Assert.fail("");
        }

        // 2. format
        if (typeof format === "function") {
            this.format = format;
            Assert.truthy(format.length === 1);
        } else {
            // If not a function, the parameter should only be undefined or null.
            Assert.truthy(format === undefined || format === null);
            // Default format
            this.format = Format.commify;
        }

        // 3. filter
        if (typeof filter === "function") {
            this.filter = filter;
            Assert.truthy(filter.length === 1);
        } else {
            // If not a function, filter should only be undefined.
            Assert.truthy(filter === undefined || filter === null);
        }

        // 4. Style class
        this.styleClass = styleClass;
    }

    public getStyleClass(): string {
        return this.styleClass;
    }

    public addControl(ctrl: Control): void {
        const list = this.controls;
        if ($.contains(list, ctrl)) {
            Assert.fail("Control already contained within this component.");
            return;
        }
        this.updateValueAsText();
        ctrl.render();
        list.push(ctrl);
    }

    public removeControl(ctrl: Control): void {
        const list = this.controls;
        let index = $.indexOf(list, ctrl);
        if (index === -1) {
            Assert.fail("Cannot remove a control that isn't present in the control list.");
            return;
        }
        list.splice(index, 1);
    }

    private updateValueAsText(): boolean {
        const newValueAsText = this.format(this._value);
        if (this.valueAsText === newValueAsText) {
            // Textual representation of the current value of
            // the component is the same as the one from the
            // last time the component was rendered, thus
            // re-rendering the attached elements to the same
            // value is not required and can be avoided.
            return false;
        }
        this.valueAsText = newValueAsText;
        return true;
    }

    public getValueAsText(): string {
        return this.valueAsText;
    }

    public get val(): number {
        return this._value;
    }

    public set val(value: number) {
        if (typeof value !== "number" || value < 0 || value === 1/0 || value !== value) {
            // Ensure the component's value remains a primitive, non-negative, finite number.
            // Ignore invalid values
            Assert.fail("");
            return;
        }

        if (this._value === value) {
            // New value is same as old value, so do nothing.
            return;
        }

        // Set new value
        const filter = this.filter;
        this._value = filter ? filter(value) : value;

        // Check if a new max value has been reached
        if (value > this.maxValueReached) {
            // Remember new max value
            this.maxValueReached = value;

            // Invoke appropriate listeners
            const listeners = this.maxValueListeners;
            if (listeners) {
                while (listeners.length > 0) {
                    var entry = listeners[listeners.length - 1];

                    if (entry.value > value) {
                        // Entry value is too large; so there's no point
                        // of checking further since the listener array
                        // is sorted in ascending order, thus consecutive
                        // values cannot be any smaller.
                        break;
                    }

                    // The listener must be removed before it is invoked.
                    // If the listener is invoked before it is removed, a
                    // endless recursion might occur if the listener sets
                    // the value of the component.
                    listeners.pop();
                    // Now the listener can be safely invoked.
                    entry.listener();
                }
            }
        }

        // Update content of attached elements
        Display.queueForRender(this);
    }

    public render(): void {
        const controls = this.controls;
        if (controls.length === 0) {
            // No elements to render
            return;
        }

        const renderRequired = this.updateValueAsText();
        if (!renderRequired) {
            // Textual representation of the current value of
            // the component is the same as the one from the
            // last time the component was rendered, thus
            // re-rendering the attached elements to the same
            // value is not required and can be avoided.
            return;
        }

        for (let i = 0; i < controls.length; i++) {
            controls[i].render();
        }
    }

    public whenReached(value: number, listener: ()=>void): void {
        // Validate arguments
        if (typeof value !== "number")
            throw new TypeError("Argument 'value' must be a primitive number.");
        if (value < 0 || value === 1/0 || value !== value)
            throw new Error("Argument 'value' must be a positive, non-negative, finite number.");
        if (typeof listener !== "function")
            throw new TypeError("Argument 'listener' must be a function.");
        if (listener.length !== 0)
            throw new Error("Function 'listener' cannot have any parameters.");

        if (this.maxValueReached >= value) {
            // Value has been previously reached, so
            // just invoke the listener immediately.
            listener();
            // No need to add to listener list
            return;
        }

        var entry = {value, listener};

        var listeners = this.maxValueListeners;
        if (!listeners) {
            // Create the listener array when a listener
            // is added for the first time.
            this.maxValueListeners = [entry];
            return
        }

        // Find insert index to keep array sorted by value from
        // largest to smallest.
        // todo: Binary-search could potentially be used,
        // todo: but for now a simple linear search should suffice.
        var insertAt = -1;
        for (var i = 0; i < listeners.length; i++) {
            if (value > listeners[i].value) {
                insertAt = i;
                break;
            }
        }

        // Insert into the correct index to keep the array sorted by value
        if (insertAt === -1) {
            listeners.push(entry);
        } else {
            listeners.splice(insertAt, 0, entry);
        }
    }
}