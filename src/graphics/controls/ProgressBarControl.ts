/**
 * A progress bar visual control.
 */
class ProgressBarControl implements Control {
    private filler: HTMLElement;
    private valueCmp: Component;
    private maxCmp: Component;

    /**
     * Creates a new ProgressBarControl object.
     *
     * @param filler An element which acts as the filler of the progress bar.
     * @param valueCmp A Component that provides the value of progress bar.
     * @param maxCmp A Component that provides the maximum value of the progress bar.
     */
    constructor(filler: HTMLElement, valueCmp: Component, maxCmp: Component) {
        this.filler = filler;
        Assert.is(getComputedStyle(filler).display === "block");
        this.valueCmp = valueCmp;
        this.maxCmp = maxCmp;
    }

    public /*implement*/ show(): void {
        this.valueCmp.addControl(this);
        this.maxCmp.addControl(this);
    }

    public /*implement*/ hide(): void {
        this.valueCmp.removeControl(this);
        this.maxCmp.removeControl(this);
    }

    public /*implement*/ render(): void {
        const value = this.valueCmp.val;
        const max = this.maxCmp.val;

        //Assert.is(value <= max);
        Assert.is(value >= 0);
        Assert.is(max > 0);

        // Ensure the progress bar isn't too full or too empty(?).
        let percentage = 100*value/max;
        if (percentage < 0) percentage = 0;
        else if (percentage > 100) percentage = 100;

        this.filler.style.width = percentage + "%";
    }
}

