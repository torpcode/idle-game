/**
 * A control that projects the value of a Component.
 */
class LabelControl implements Control {
    private element: HTMLElement;
    private component: Component;

    constructor(element: HTMLElement, component: Component) {
        this.element = element;
        this.component = component;
    }

    public /*override*/ show(): void {
        this.component.addControl(this);
    }

    public /*override*/ hide(): void {
        this.component.removeControl(this);
    }

    public /*override*/ render(): void {
        this.element.innerHTML = this.component.getValueAsText();
    }
}