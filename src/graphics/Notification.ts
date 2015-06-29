class Notification {
    private static LIFE_TIME = 5000;
    private static MARGIN = 42;

    // Pool
    private static livingList: Notification[] = [];
    private static deadList: Notification[] = [];

    private element: HTMLElement;
    private lifeTimer: number;

    constructor() {
        this.element = document.createElement("div");
        this.element.className = "notification";
    }

    public recycle(htmlText: string): void {
        const element = this.element;
        element.innerHTML = htmlText;
        element.style.bottom = "0px";
        document.body.appendChild(element);

        const livingList = Notification.livingList;
        for (let i = 0; i < livingList.length; i++) {
            const e = livingList[i].element;
            e.style.bottom = ((livingList.length - i)*Notification.MARGIN) + "px";
        }

        this.lifeTimer = Notification.LIFE_TIME;
    }

    private update(elapsedMS: number): boolean {
        this.lifeTimer -= elapsedMS;
        if (this.lifeTimer <= 0) {
            const element = this.element;
            element.parentNode.removeChild(element);
            return true;
        }
        return false;
    }

    public static updateAll(elapsedMS: number): void {
        const livingList = this.livingList;
        for (let i = 0; i < livingList.length; i++) {
            const ntf: Notification = livingList[i];
            const dead: boolean = ntf.update(elapsedMS);
            if (dead) {
                livingList.splice(i, 1);
                i--;
                this.deadList.push(ntf);
            }
        }
    }

    public static create(htmlText: string): void {
        let notification: Notification;
        if (this.deadList.length > 0) {
            notification = this.deadList.pop();
        } else {
            notification = new Notification();
        }
        notification.recycle(htmlText);
        this.livingList.push(notification);
    }
}