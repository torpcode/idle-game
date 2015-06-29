class DisplayContainer {
    private element: HTMLElement;
    private controls: Control[] = [];
    private id: string;
    private visible: boolean;
    private navButton: HTMLElement;

    constructor(id: string, element: HTMLElement) {
        this.id = id;
        this.element = element;

        const navButton = (this.navButton = document.createElement("div"));
        navButton.innerHTML = id;
        navButton.addEventListener("click", () => Display.switchContainer(id));
        $.id("nav-bar").appendChild(navButton);

        // Containers are hidden by default
        this.hide();
    }

    public show(): void {
        this.visible = true;
        this.element.style.display = "block";
        this.navButton.className += " current-nav";

        // Show controls
        for (let ctrl of this.controls) {
            ctrl.show();
        }
    }

    public hide(): void {
        this.visible = false;
        this.element.style.display = "none";
        this.navButton.className = this.navButton.className.replace(/\bcurrent-nav\b/, '');

        // Hide controls
        for (let ctrl of this.controls) {
            ctrl.hide();
        }
    }

    public addControl(control: Control): void {
        const list = this.controls;
        if ($.contains(list, control)) {
            Assert.fail("A Control cannot be added twice to the same DisplayContainer.");
            return;
        }
        list.push(control);
    }
}