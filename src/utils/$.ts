module $ {
    export function id(elementId: string): HTMLElement {
        Assert.isString(elementId);
        const element = document.getElementById(elementId);
        if (!element) {
            // Better throw an error now, than return
            // undefined and have to deal with a less
            // obvious error somewhere down the line.
            throw new Error("No element with such an Id exists.");
        }
        return element;
    }

    export function anyMatch<T>(array: T[], predicate: (value: T)=>boolean): boolean {
        for (let i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
                return true;
            }
        }
        return false;
    }

    export function contains<T>(array: T[], item: T): boolean {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return true;
            }
        }
        return false;
    }

    export function indexOf<T>(array: T[], item: T): number {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return -1;
    }
}