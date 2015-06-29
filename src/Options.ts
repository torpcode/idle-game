module Options {
    /*export let floatingLabels = new GameOption<boolean>(true, {
        element: $.id("options-floating-labels"),
        render: (value: boolean, element: HTMLInputElement) => {
            element.checked = value;
        }
    });*/

    export let floatingLabelsEnabled: boolean = true;
    export let autoSaveEnabled: boolean = true;
    export let autoSaveInterval: number = 7000; // ms

    function bindCheckBox(optionName: string, checkBoxId: string): void {
        Assert.isBool(Options[optionName]);
        const checkBox = <HTMLInputElement> $.id(checkBoxId);
        Assert.is(checkBox instanceof HTMLInputElement);

        checkBox.checked = Options[optionName];
        checkBox.addEventListener("change", (e: Event) => {
            Assert.is(e.target === checkBox);
            const checked = (<HTMLInputElement> e.target).checked;
            Assert.isBool(checked);
            Options[optionName] = checked;
        });
    }

    export function init(/*storage: StorageDevice*/): void {
        const floatLabelsCb = <HTMLInputElement> $.id("options-floating-labels");
        const autoSaveCb = <HTMLInputElement> $.id("options-auto-save");
        const autoSaveIntervalTb = <HTMLInputElement> $.id("option-auto-save-interval");
        const autoSaveIntervalApplyBtn = <HTMLInputElement> $.id("option-auto-save-apply");

        floatLabelsCb.addEventListener("change", (e: Event) => {
            Options.floatingLabelsEnabled = (<HTMLInputElement> e.target).checked;
        });
        autoSaveCb.addEventListener("change", (e: Event) => {
            Options.autoSaveEnabled = (<HTMLInputElement> e.target).checked;
        });
        /*autoSaveIntervalTb.addEventListener("keydown", (e: KeyboardEvent) => {
         event.preventDefault();
         if (event["shiftKey"]) {
         //event.preventDefault();
         return;
         }
         const keyCode = e.keyCode;
         if (keyCode < 48 || keyCode > 57) {
         //event.preventDefault();
         return;
         }
         autoSaveIntervalTb.value += (keyCode - 48);

         //e.keyCode = 50;
         console.log(e.keyCode);
         });*/

        autoSaveIntervalApplyBtn.addEventListener("click", (e: MouseEvent) => {
            let interval = Math.floor(Number(autoSaveIntervalTb.value));
            if (interval < 1 || interval !== interval) {
                // Invalid value, return to current value
                autoSaveIntervalTb.value = "" + (autoSaveInterval/1000);
                return;
            }
            if (interval > 999) {
                // Exceeds maximum value
                interval = 999;
                autoSaveIntervalTb.value = "" + interval;
            }
            autoSaveInterval = interval*1000;
        });

        /*storage.onSave(data => {
            data.optionFloatingLabels = floatingLabelsEnabled;
            data.optionAutoSave = autoSaveEnabled;
            data.optionAutoSaveInterval = autoSaveInterval;
        });
        storage.onLoad(data => {
            /*if (data.hasOwnProperty("optionFloatingLabels")) {
                floatLabelsCb.checked = floatingLabelsEnabled = !!data.optionFloatingLabels;
            }*
            if (data.hasOwnProperty("optionAutoSave")) {
                autoSaveCb.checked = autoSaveEnabled = !!data.optionAutoSave;
            }
        });*/
    }
}
/*
class GameOption<T> {
    public value: T;
    private element: HTMLElement;
    private render: (value: T, element: HTMLElement)=>void;

    constructor(value: T, args: {
        element: HTMLElement;
        render: (value: T, element: HTMLElement)=>void;
    }) {
        this.element = args.element;
        this.render = args.render;
        this.value = value;
    }

    public setAndRender(value: T): void {
        this.value = value;
        this.render(value, this.element);
    }
}*/