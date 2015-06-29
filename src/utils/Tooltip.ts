module Tooltip {
    let tooltipElem: HTMLElement;
    let visible: boolean = false;

    export function attachText(element: HTMLElement, htmlText: string): void {
        if (!tooltipElem) {
            tooltipElem = $.id("tooltip");
        }

        element.addEventListener("mouseover", (e: MouseEvent) => {
            Assert.falsy(visible);
            if (visible) {
                return;
            }
            visible = true;

            const bounds = element.getBoundingClientRect();
            tooltipElem.style.left = (bounds.right + 5) + "px";
            tooltipElem.style.top = bounds.top + "px";

            tooltipElem.innerHTML = htmlText;
            tooltipElem.style.display = "block";
        });
        element.addEventListener("mouseout", (e: MouseEvent) => {
            Assert.truthy(visible);
            if (!visible) {
                return;
            }
            visible = false;

            tooltipElem.style.display = "none";
            tooltipElem.innerHTML = "";
        });
    }

    export function attachFunc(element: HTMLElement, htmlTextGetter: ()=>string): void {
        if (!tooltipElem) {
            tooltipElem = $.id("tooltip");
        }

        element.addEventListener("mouseover", (e: MouseEvent) => {
            Assert.falsy(visible);
            if (visible) {
                return;
            }
            visible = true;

            const bounds = element.getBoundingClientRect();
            tooltipElem.style.left = (bounds.right + 5) + "px";
            tooltipElem.style.top = bounds.top + "px";

            tooltipElem.innerHTML = htmlTextGetter();
            tooltipElem.style.display = "block";
        });
        element.addEventListener("mouseout", (e: MouseEvent) => {
            Assert.truthy(visible);
            if (!visible) {
                return;
            }
            visible = false;

            tooltipElem.style.display = "none";
            tooltipElem.innerHTML = "";
        });
    }
}