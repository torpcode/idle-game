class FloatingLabel {
    private static LIFE_TIME = 1000;
    private static FADE_TIME = 300;

    // Pool
    private static livingList: FloatingLabel[] = [];
    private static deadList: FloatingLabel[] = [];

    private element: HTMLElement;
    private y: number;
    private lifeTime: number;

    constructor() {
        this.element = document.createElement("div");
        this.element.className = "floating-label";
    }

    private recycle(htmlText: string, target: HTMLElement, color: string): void {
        const element = this.element;
        element.innerHTML = htmlText;
        element.style.opacity = "1"; // Important! opacity will be <1 when recycling a label due to the fade effect.
        element.style.color = color;
        document.body.appendChild(element);

        // To position the element its size must be calculated,
        // and that is only possible after the content of the
        // element is set and after it is added to the document.
        const targetBounds = target.getBoundingClientRect();
        const x = targetBounds.left + targetBounds.width/2;
        const y = targetBounds.top; // + targetBounds.height/2;
        element.style.left = (x - element.offsetWidth/2) + "px";
        element.style.top = (this.y = y) + "px";

        this.lifeTime = FloatingLabel.LIFE_TIME;
    }

    private update(elapsedMS: number): boolean {
        const element = this.element;
        // Account for elapsed time
        const lifeTime = (this.lifeTime -= elapsedMS);

        if (lifeTime <= 0) {
            // Label is kill
            element.parentNode.removeChild(element);
            return true;
        }

        // Slide the label upwards
        const y = (this.y -= (lifeTime/FloatingLabel.LIFE_TIME)*(elapsedMS/7));
        element.style.top = y + "px";

        // Fade out shortly before dying
        if (lifeTime <= FloatingLabel.FADE_TIME) {
            element.style.opacity = "" + (lifeTime/FloatingLabel.FADE_TIME);
        }
        return false;
    }

    public static create(htmlText: string, target: HTMLElement, color: string): void {
        if (!Options.floatingLabelsEnabled) {
            return;
        }

        let label: FloatingLabel;
        if (this.deadList.length > 0) {
            label = this.deadList.pop();
        } else {
            label = new FloatingLabel();
        }
        label.recycle(htmlText, target, color);
        this.livingList.push(label);
    }

    public static updateAll(elapsedMS: number): void {
        const livingList = this.livingList;
        for (let i = 0; i < livingList.length; i++) {
            const lbl: FloatingLabel = livingList[i];
            const dead: boolean = lbl.update(elapsedMS);
            if (dead) {
                livingList.splice(i, 1);
                i--;
                this.deadList.push(lbl);
            }
        }
    }
}