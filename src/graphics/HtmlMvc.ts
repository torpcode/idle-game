module HtmlMvc {
    const definedObjects: {[name: string]: HTMLElement} = Object.create(null);

    export function define(name: string, object: any): void {
        Assert.isString(name);
        Assert.truthy(object);

        if (name in definedObjects) {
            // Defined object names must be unique
            throw new Error();
        }
        definedObjects[name] = object;
    }

    export function parseHtml(): void {
        traverse(document.body);
    }

    function traverse(root: HTMLElement, container?: DisplayContainer): void {
        const children = root.children;
        for (let i = 0; i < children.length; i++) {
            const element = <HTMLElement> children[i];

            const oldContainer = container;

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // mk-value
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (element.hasAttribute("mk-value")) {
                let path = element.getAttribute("mk-value");

                const ignoreCmpStyle = path.charCodeAt(0) === "!".charCodeAt(0);
                if (ignoreCmpStyle) {
                    // Remove the "!" from the component path
                    path = path.substr(1);
                }
                /*if (path.charCodeAt(0) === "!".charCodeAt(0)) {
                    ignoreCmpStyle = true;
                }*/

                const component = <Component> resolve(path);
                if (!(component instanceof Component)) {
                    throw new TypeError("Specified path does not reference a valid Component.");
                }
                const label = new LabelControl(element, component);
                if (container) {
                    container.addControl(label);
                } else {
                    label.show();
                }

                // Component style
                if (!ignoreCmpStyle) {
                    const cmpStyle: string = component.getStyleClass();
                    if (cmpStyle) {
                        Assert.is(element.className.split(" ").indexOf(cmpStyle) === -1);
                        element.className += " " + cmpStyle;
                    }
                }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // mk-progress
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (element.hasAttribute("mk-progress")) {
                const paths = element.getAttribute("mk-progress");
                const split = paths.split("/");
                if (split.length !== 2) {
                    throw new Error("The value of the 'mk-progress' attribute must consist of exactly two component paths, separated by a backslash.");
                }
                const valueCmp = resolve(split[0]);
                const maxCmp = resolve(split[1]);
                const progressBar = new ProgressBarControl(<HTMLElement> element.firstElementChild, valueCmp, maxCmp);
                if (container) {
                    container.addControl(progressBar);
                } else {
                    progressBar.show();
                }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // mk-container
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (element.hasAttribute("mk-container")) {
                const containerId = element.getAttribute("mk-container");
                Assert.falsy(container);
                container = Display.createContainer(element, containerId);
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // mk-tooltip
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (element.hasAttribute("mk-tooltip")) {
                const tooltipText = element.getAttribute("mk-tooltip");
                Assert.is(/\S/.test(tooltipText)); // assert string is not empty or whitespace
                Tooltip.attachText(element, tooltipText);
            }

            // Continue recursive traversal too all descendants
            traverse(element, container);
            container = oldContainer;
        }
    }

    function resolve(path: string): any {
        const split = path.split(".");

        // Resolve path
        let ref: any = definedObjects;
        for (let i = 0; i < split.length; i++) {
            if (!ref) {
                throw new Error("Invalid reference path.");
            }
            ref = ref[split[i]];
        }

        return ref;
    }


}