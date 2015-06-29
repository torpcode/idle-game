// Enable strict mode as it's more predictable and easier to work with.
"use strict";
// Game configurations and other constants.
var Config = {
    FRAME_RATE: 30,
    SAVE_KEY: "idle_game_save"
};
Object.freeze(Config);
/**
 * Provides functions for asserting various conditions.
 */
var Assert;
(function (Assert) {
    /**
     * Assert that a value is primitive boolean `true`.
     */
    function is(value) {
        if (value !== true) {
            fail("Expected value to be `true`.");
        }
    }
    Assert.is = is;
    function not(value) {
        if (value === true) {
            fail("Expected value to be `false`.");
        }
    }
    Assert.not = not;
    /**
     * Assert that a value is primitive boolean `false`.
     */
    /*export function not(value: any): void {
        if (value === true) {
            fail("Expected value to be `false`.");
        }
    }*/
    /**
     * Assert that a value is `truthy`.
     * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy}
     */
    function truthy(value) {
        if (!value) {
            fail("Expected value to be truthy.");
        }
    }
    Assert.truthy = truthy;
    /**
     * Asserts that a value is `falsy`.
     * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy}
     */
    function falsy(value) {
        if (value) {
            fail("Expected value to be falsy.");
        }
    }
    Assert.falsy = falsy;
    function isBool(value) {
        if (typeof value !== "boolean") {
            fail("Expected value to be a boolean.");
        }
    }
    Assert.isBool = isBool;
    function isString(value) {
        if (typeof value !== "string") {
            fail("Expected value to be a string.");
        }
    }
    Assert.isString = isString;
    /**
     * Asserts that two values are equal according to the strict equality operator.
     */
    function equal(a, b) {
        if (a !== b) {
            fail("Expected values to be equal.");
        }
    }
    Assert.equal = equal;
    function isFunc(func, argLength) {
        if (typeof func !== "function") {
            fail("Expected value to be a function.");
        }
        if (typeof argLength === "number") {
            if (func.length !== argLength) {
                fail("Unexpected number of function arguments.");
            }
        }
    }
    Assert.isFunc = isFunc;
    function fail(errorMessage) {
        throw new Error("Assertion error: " + errorMessage);
    }
    Assert.fail = fail;
})(Assert || (Assert = {}));
var Format;
(function (Format) {
    var COMMIFY_REGEX = /\B(?=(\d{3})+(?!\d))/g;
    // ToDo: Improve documentation?
    /**
     * Rounds and adds commas to a number.
     */
    function commify(value) {
        if (typeof value !== "number") {
            Assert.fail("Argument 'value' must be a primitive number.");
            return "NaN";
        }
        value = Math.floor(value);
        // Commas not needed for numbers with
        // less than four digits.
        if (value > 1000 && value < 1000) {
            return "" + value;
        }
        // Add commas to number
        return ("" + value).replace(COMMIFY_REGEX, ",");
    }
    Format.commify = commify;
    /**
     * Converts a time span of milliseconds into a string representation in the format of: `D days, HH:MM:SS`.
     */
    function timeSpan(milliseconds) {
        var t = milliseconds;
        if (typeof t !== "number" || t < 0 || t === 1 / 0 || t !== t) {
            Assert.fail("Invalid time span value.");
            return "??:??:??";
        }
        // seconds
        t /= 1000;
        var SS = Math.floor(t % 60);
        if (SS < 10)
            SS = "0" + SS;
        // minutes
        t /= 60;
        var MM = Math.floor(t % 60);
        if (MM < 10)
            MM = "0" + MM;
        // hours
        t /= 60;
        var HH = Math.floor(t % 24);
        if (HH < 10)
            HH = "0" + HH;
        // days
        t /= 24;
        var days = Math.floor(t % 24);
        return days + " days, " + HH + ":" + MM + ":" + SS;
    }
    Format.timeSpan = timeSpan;
    var MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    function unixToDate(utcMillis) {
        if (utcMillis === undefined) {
            return "Unknown Date";
        }
        if (typeof utcMillis !== "number") {
            Assert.fail("Argument 'utcMillis' must either be undefined or a primitive number.");
            return "Unknown Date";
        }
        var date = new Date(utcMillis);
        // Detect invalid date instances
        var time = date.getTime();
        if (time !== time) {
            Assert.fail("Invalid date.");
            return "Unknown";
        }
        return date.getDay() + " " + MONTHS_SHORT[date.getMonth()] + " " + date.getFullYear();
    }
    Format.unixToDate = unixToDate;
})(Format || (Format = {}));
var Tooltip;
(function (Tooltip) {
    var tooltipElem;
    var visible = false;
    function attachText(element, htmlText) {
        if (!tooltipElem) {
            tooltipElem = $.id("tooltip");
        }
        element.addEventListener("mouseover", function (e) {
            Assert.falsy(visible);
            if (visible) {
                return;
            }
            visible = true;
            var bounds = element.getBoundingClientRect();
            tooltipElem.style.left = (bounds.right + 5) + "px";
            tooltipElem.style.top = bounds.top + "px";
            tooltipElem.innerHTML = htmlText;
            tooltipElem.style.display = "block";
        });
        element.addEventListener("mouseout", function (e) {
            Assert.truthy(visible);
            if (!visible) {
                return;
            }
            visible = false;
            tooltipElem.style.display = "none";
            tooltipElem.innerHTML = "";
        });
    }
    Tooltip.attachText = attachText;
    function attachFunc(element, htmlTextGetter) {
        if (!tooltipElem) {
            tooltipElem = $.id("tooltip");
        }
        element.addEventListener("mouseover", function (e) {
            Assert.falsy(visible);
            if (visible) {
                return;
            }
            visible = true;
            var bounds = element.getBoundingClientRect();
            tooltipElem.style.left = (bounds.right + 5) + "px";
            tooltipElem.style.top = bounds.top + "px";
            tooltipElem.innerHTML = htmlTextGetter();
            tooltipElem.style.display = "block";
        });
        element.addEventListener("mouseout", function (e) {
            Assert.truthy(visible);
            if (!visible) {
                return;
            }
            visible = false;
            tooltipElem.style.display = "none";
            tooltipElem.innerHTML = "";
        });
    }
    Tooltip.attachFunc = attachFunc;
})(Tooltip || (Tooltip = {}));
var $;
(function ($) {
    function id(elementId) {
        Assert.isString(elementId);
        var element = document.getElementById(elementId);
        if (!element) {
            // Better throw an error now, than return
            // undefined and have to deal with a less
            // obvious error somewhere down the line.
            throw new Error("No element with such an Id exists.");
        }
        return element;
    }
    $.id = id;
    function anyMatch(array, predicate) {
        for (var i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
                return true;
            }
        }
        return false;
    }
    $.anyMatch = anyMatch;
    function contains(array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return true;
            }
        }
        return false;
    }
    $.contains = contains;
    function indexOf(array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return -1;
    }
    $.indexOf = indexOf;
})($ || ($ = {}));
var Ensure;
(function (Ensure) {
    function isString(value) {
        if (typeof value !== "string") {
            throw new Error("Value must be a primitive string.");
        }
    }
    Ensure.isString = isString;
})(Ensure || (Ensure = {}));
var LoadedData = (function () {
    function LoadedData(dataObj) {
        this.dataObj = dataObj;
    }
    LoadedData.prototype.readCmp = function (key, cmp) {
        var dataObj = this.dataObj;
        if (dataObj.hasOwnProperty(key)) {
            var data = dataObj[key];
            // todo: typeof data === "number"?
            if (data !== undefined && data !== null) {
                cmp.val = data;
            }
        }
    };
    LoadedData.prototype.read = function (key, ref) {
        var dataObj = this.dataObj;
        if (dataObj.hasOwnProperty(key)) {
            var data = dataObj[key];
            if (data !== undefined && data !== null) {
                ref(data);
            }
        }
    };
    LoadedData.load = function (key) {
        var data = localStorage.getItem(key);
        if (!data) {
            // No saved data found
            return null;
        }
        try {
            data = JSON.parse(data);
        }
        catch (ex) {
            // Bad or corrupt data
            Assert.fail("Bad save data.");
            return null;
        }
        return new LoadedData(data);
    };
    return LoadedData;
})();
var SaveTarget = (function () {
    function SaveTarget() {
        this.dataObj = {};
        this.saved = false;
    }
    SaveTarget.prototype.write = function (key, data) {
        if (this.saved) {
            Assert.fail("The specified SaveTarget object has already been saved.");
            return;
        }
        var dataObj = this.dataObj;
        if (dataObj.hasOwnProperty(key)) {
            throw new Error("Target object already has data for the following key.");
        }
        dataObj[key] = data;
    };
    SaveTarget.prototype.save = function (key) {
        if (this.saved) {
            Assert.fail("The specified SaveTarget object has already been saved.");
            return;
        }
        this.saved = true;
        localStorage.setItem(key, JSON.stringify(this.dataObj));
    };
    return SaveTarget;
})();
/**
 * Handles the visual state and rendering of the game.
 */
var Display;
(function (Display) {
    // An object that maps all the display containers to their unique id.
    var containerById = Object.create(null);
    // The display container which is currently visible.
    var currentContainer;
    function switchContainer(containerId) {
        Ensure.isString(containerId);
        // Get new container
        var newContainer = containerById[containerId];
        if (!newContainer) {
            Assert.fail("No DisplayContainer with the specified id exists.");
            return;
        }
        if (newContainer === currentContainer) {
            // Requested container is already
            // visible, do nothing.
            return;
        }
        // Hide current container
        if (currentContainer) {
            // (Check is required for the first call)
            currentContainer.hide();
        }
        // And show the new container
        newContainer.show();
        // Remember new container
        currentContainer = newContainer;
    }
    Display.switchContainer = switchContainer;
    function createContainer(element, containerId) {
        // Ensure container id is unique
        if (containerById[containerId]) {
            throw new Error("A DisplayContainer with this id already exists. DisplayContainer ids must be unique.");
        }
        // Create the new container
        var container = new DisplayContainer(containerId, element);
        containerById[containerId] = container;
        return container;
    }
    Display.createContainer = createContainer;
    // The head and tail of a singly-linked-list structure
    // used internally to store display nodes queued for
    // rendering.
    var firstNode, lastNode;
    function queueForRender(node) {
        if (node.isQueuedForRender) {
            // This node is already queued for rendering, a node
            // shouldn't be rendered twice in the frame.
            return;
        }
        node.isQueuedForRender = true;
        if (!firstNode) {
            Assert.falsy(lastNode);
            // Render queue is empty.
            firstNode = lastNode = node;
        }
        else {
            Assert.truthy(lastNode);
            // Render queue is not empty.
            lastNode.nextQueued = node;
            lastNode = node;
        }
        // Invalidate new node
        node.nextQueued = null;
    }
    Display.queueForRender = queueForRender;
    function render() {
        // Render queued nodes
        var node = firstNode;
        while (node) {
            node.render();
            node.isQueuedForRender = false;
            // Invalidating the 'next' reference of the node is
            // currently not required, since its value isn't used
            // for anything other than when the node is queued for
            // rendering; in which case the 'next' property of
            // the node is specifically set when it is queued.
            node = node.nextQueued;
        }
        // Empty the render queue
        firstNode = lastNode = null;
    }
    Display.render = render;
})(Display || (Display = {}));
var DisplayContainer = (function () {
    function DisplayContainer(id, element) {
        this.controls = [];
        this.id = id;
        this.element = element;
        var navButton = (this.navButton = document.createElement("div"));
        navButton.innerHTML = id;
        navButton.addEventListener("click", function () { return Display.switchContainer(id); });
        $.id("nav-bar").appendChild(navButton);
        // Containers are hidden by default
        this.hide();
    }
    DisplayContainer.prototype.show = function () {
        this.visible = true;
        this.element.style.display = "block";
        this.navButton.className += " current-nav";
        // Show controls
        for (var _i = 0, _a = this.controls; _i < _a.length; _i++) {
            var ctrl = _a[_i];
            ctrl.show();
        }
    };
    DisplayContainer.prototype.hide = function () {
        this.visible = false;
        this.element.style.display = "none";
        this.navButton.className = this.navButton.className.replace(/\bcurrent-nav\b/, '');
        // Hide controls
        for (var _i = 0, _a = this.controls; _i < _a.length; _i++) {
            var ctrl = _a[_i];
            ctrl.hide();
        }
    };
    DisplayContainer.prototype.addControl = function (control) {
        var list = this.controls;
        if ($.contains(list, control)) {
            Assert.fail("A Control cannot be added twice to the same DisplayContainer.");
            return;
        }
        list.push(control);
    };
    return DisplayContainer;
})();
/*class BoundComponent implements DisplayNode {
    // DisplayNode interface
    public isQueuedForRender: boolean;
    public nextQueued: DisplayNode;

    private _value: number;
    private _maximum: number;
    private progressBars: HTMLElement[];

    constructor() {
    }

    public get val(): number {
        return this._value;
    }

    public set val(value: number) {
        if (typeof value !== "number" || value < 0 || value === 1/0 || value !== value) {
            // Ensure the component's value remains a primitive, non-negative, finite number.
            value = 0;
        }

        // Ensure value does not exceed the maximum allowed
        const max = this._maximum;
        if (value > max) {
            value = max;
        }

        if (this._value === value) {
            // New value is same as old value, so do nothing.
            return;
        }

        // Set new value
        this._value = value;

        Display.queueForRender(this);
    }

    public get max(): number {
        return this._maximum;
    }

    public set max(maximum: number) {
        if (typeof maximum !== "number" || maximum < 0 || maximum === 1/0 || maximum !== maximum) {
            // Ensure the component's value remains a primitive, non-negative, finite number.
            maximum = 0;
        }

        if (this._maximum === maximum) {
            // New value is same as old value, so do nothing.
            return;
        }

        // Set new value
        this._maximum = maximum;

        // Ensure current value does not exceed the
        // new maximum, if it is smaller than the
        // previous maximum.
        if (maximum < this._value) {
            this._value = maximum;
        }

        Display.queueForRender(this);
    }

    public addProgressBar(progressBar: HTMLElement): void {
        this.progressBars.push(progressBar);
    }

    public render(): void {
        const progressBars = this.progressBars;
        if (progressBars.length > 0) {
            const percentageFull = (100*this._value/this._maximum) + "%";
            for (let i = 0; i < progressBars.length; i++) {
                progressBars[i].style.widows = percentageFull;
            }
        }
    }
}*/ 
var HtmlMvc;
(function (HtmlMvc) {
    var definedObjects = Object.create(null);
    function define(name, object) {
        Assert.isString(name);
        Assert.truthy(object);
        if (name in definedObjects) {
            // Defined object names must be unique
            throw new Error();
        }
        definedObjects[name] = object;
    }
    HtmlMvc.define = define;
    function parseHtml() {
        traverse(document.body);
    }
    HtmlMvc.parseHtml = parseHtml;
    function traverse(root, container) {
        var children = root.children;
        for (var i = 0; i < children.length; i++) {
            var element = children[i];
            var oldContainer = container;
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // mk-value
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (element.hasAttribute("mk-value")) {
                var path = element.getAttribute("mk-value");
                var ignoreCmpStyle = path.charCodeAt(0) === "!".charCodeAt(0);
                if (ignoreCmpStyle) {
                    // Remove the "!" from the component path
                    path = path.substr(1);
                }
                /*if (path.charCodeAt(0) === "!".charCodeAt(0)) {
                    ignoreCmpStyle = true;
                }*/
                var component = resolve(path);
                if (!(component instanceof Component)) {
                    throw new TypeError("Specified path does not reference a valid Component.");
                }
                var label = new LabelControl(element, component);
                if (container) {
                    container.addControl(label);
                }
                else {
                    label.show();
                }
                // Component style
                if (!ignoreCmpStyle) {
                    var cmpStyle = component.getStyleClass();
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
                var paths = element.getAttribute("mk-progress");
                var split = paths.split("/");
                if (split.length !== 2) {
                    throw new Error("The value of the 'mk-progress' attribute must consist of exactly two component paths, separated by a backslash.");
                }
                var valueCmp = resolve(split[0]);
                var maxCmp = resolve(split[1]);
                var progressBar = new ProgressBarControl(element.firstElementChild, valueCmp, maxCmp);
                if (container) {
                    container.addControl(progressBar);
                }
                else {
                    progressBar.show();
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // mk-container
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (element.hasAttribute("mk-container")) {
                var containerId = element.getAttribute("mk-container");
                Assert.falsy(container);
                container = Display.createContainer(element, containerId);
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // mk-tooltip
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (element.hasAttribute("mk-tooltip")) {
                var tooltipText = element.getAttribute("mk-tooltip");
                Assert.is(/\S/.test(tooltipText)); // assert string is not empty or whitespace
                Tooltip.attachText(element, tooltipText);
            }
            // Continue recursive traversal too all descendants
            traverse(element, container);
            container = oldContainer;
        }
    }
    function resolve(path) {
        var split = path.split(".");
        // Resolve path
        var ref = definedObjects;
        for (var i = 0; i < split.length; i++) {
            if (!ref) {
                throw new Error("Invalid reference path.");
            }
            ref = ref[split[i]];
        }
        return ref;
    }
})(HtmlMvc || (HtmlMvc = {}));
var FloatingLabel = (function () {
    function FloatingLabel() {
        this.element = document.createElement("div");
        this.element.className = "floating-label";
    }
    FloatingLabel.prototype.recycle = function (htmlText, target, color) {
        var element = this.element;
        element.innerHTML = htmlText;
        element.style.opacity = "1"; // Important! opacity will be <1 when recycling a label due to the fade effect.
        element.style.color = color;
        document.body.appendChild(element);
        // To position the element its size must be calculated,
        // and that is only possible after the content of the
        // element is set and after it is added to the document.
        var targetBounds = target.getBoundingClientRect();
        var x = targetBounds.left + targetBounds.width / 2;
        var y = targetBounds.top; // + targetBounds.height/2;
        element.style.left = (x - element.offsetWidth / 2) + "px";
        element.style.top = (this.y = y) + "px";
        this.lifeTime = FloatingLabel.LIFE_TIME;
    };
    FloatingLabel.prototype.update = function (elapsedMS) {
        var element = this.element;
        // Account for elapsed time
        var lifeTime = (this.lifeTime -= elapsedMS);
        if (lifeTime <= 0) {
            // Label is kill
            element.parentNode.removeChild(element);
            return true;
        }
        // Slide the label upwards
        var y = (this.y -= (lifeTime / FloatingLabel.LIFE_TIME) * (elapsedMS / 7));
        element.style.top = y + "px";
        // Fade out shortly before dying
        if (lifeTime <= FloatingLabel.FADE_TIME) {
            element.style.opacity = "" + (lifeTime / FloatingLabel.FADE_TIME);
        }
        return false;
    };
    FloatingLabel.create = function (htmlText, target, color) {
        if (!Options.floatingLabelsEnabled) {
            return;
        }
        var label;
        if (this.deadList.length > 0) {
            label = this.deadList.pop();
        }
        else {
            label = new FloatingLabel();
        }
        label.recycle(htmlText, target, color);
        this.livingList.push(label);
    };
    FloatingLabel.updateAll = function (elapsedMS) {
        var livingList = this.livingList;
        for (var i = 0; i < livingList.length; i++) {
            var lbl = livingList[i];
            var dead = lbl.update(elapsedMS);
            if (dead) {
                livingList.splice(i, 1);
                i--;
                this.deadList.push(lbl);
            }
        }
    };
    FloatingLabel.LIFE_TIME = 1000;
    FloatingLabel.FADE_TIME = 300;
    // Pool
    FloatingLabel.livingList = [];
    FloatingLabel.deadList = [];
    return FloatingLabel;
})();
var Notification = (function () {
    function Notification() {
        this.element = document.createElement("div");
        this.element.className = "notification";
    }
    Notification.prototype.recycle = function (htmlText) {
        var element = this.element;
        element.innerHTML = htmlText;
        element.style.bottom = "0px";
        document.body.appendChild(element);
        var livingList = Notification.livingList;
        for (var i = 0; i < livingList.length; i++) {
            var e = livingList[i].element;
            e.style.bottom = ((livingList.length - i) * Notification.MARGIN) + "px";
        }
        this.lifeTimer = Notification.LIFE_TIME;
    };
    Notification.prototype.update = function (elapsedMS) {
        this.lifeTimer -= elapsedMS;
        if (this.lifeTimer <= 0) {
            var element = this.element;
            element.parentNode.removeChild(element);
            return true;
        }
        return false;
    };
    Notification.updateAll = function (elapsedMS) {
        var livingList = this.livingList;
        for (var i = 0; i < livingList.length; i++) {
            var ntf = livingList[i];
            var dead = ntf.update(elapsedMS);
            if (dead) {
                livingList.splice(i, 1);
                i--;
                this.deadList.push(ntf);
            }
        }
    };
    Notification.create = function (htmlText) {
        var notification;
        if (this.deadList.length > 0) {
            notification = this.deadList.pop();
        }
        else {
            notification = new Notification();
        }
        notification.recycle(htmlText);
        this.livingList.push(notification);
    };
    Notification.LIFE_TIME = 5000;
    Notification.MARGIN = 42;
    // Pool
    Notification.livingList = [];
    Notification.deadList = [];
    return Notification;
})();
/**
 * Contains commonly used colors.
 */
var Colors;
(function (Colors) {
    Colors.MANA = "#81a6ff";
    Colors.GOLD = "#ffcc11";
})(Colors || (Colors = {}));
/**
 * A control that projects the value of a Component.
 */
var LabelControl = (function () {
    function LabelControl(element, component) {
        this.element = element;
        this.component = component;
    }
    LabelControl.prototype.show = function () {
        this.component.addControl(this);
    };
    LabelControl.prototype.hide = function () {
        this.component.removeControl(this);
    };
    LabelControl.prototype.render = function () {
        this.element.innerHTML = this.component.getValueAsText();
    };
    return LabelControl;
})();
/**
 * A progress bar visual control.
 */
var ProgressBarControl = (function () {
    /**
     * Creates a new ProgressBarControl object.
     *
     * @param filler An element which acts as the filler of the progress bar.
     * @param valueCmp A Component that provides the value of progress bar.
     * @param maxCmp A Component that provides the maximum value of the progress bar.
     */
    function ProgressBarControl(filler, valueCmp, maxCmp) {
        this.filler = filler;
        Assert.is(getComputedStyle(filler).display === "block");
        this.valueCmp = valueCmp;
        this.maxCmp = maxCmp;
    }
    ProgressBarControl.prototype.show = function () {
        this.valueCmp.addControl(this);
        this.maxCmp.addControl(this);
    };
    ProgressBarControl.prototype.hide = function () {
        this.valueCmp.removeControl(this);
        this.maxCmp.removeControl(this);
    };
    ProgressBarControl.prototype.render = function () {
        var value = this.valueCmp.val;
        var max = this.maxCmp.val;
        //Assert.is(value <= max);
        Assert.is(value >= 0);
        Assert.is(max > 0);
        // Ensure the progress bar isn't too full or too empty(?).
        var percentage = 100 * value / max;
        if (percentage < 0)
            percentage = 0;
        else if (percentage > 100)
            percentage = 100;
        this.filler.style.width = percentage + "%";
    };
    return ProgressBarControl;
})();
var Component = (function () {
    function Component(value, format, filter, styleClass) {
        if (value === void 0) { value = 0; }
        this.controls = [];
        // The largest value ever reached by the component.
        this.maxValueReached = -1 / 0;
        // 1. value
        if (typeof value === "number") {
            this._value = value;
        }
        else {
            Assert.fail("");
        }
        // 2. format
        if (typeof format === "function") {
            this.format = format;
            Assert.truthy(format.length === 1);
        }
        else {
            // If not a function, the parameter should only be undefined or null.
            Assert.truthy(format === undefined || format === null);
            // Default format
            this.format = Format.commify;
        }
        // 3. filter
        if (typeof filter === "function") {
            this.filter = filter;
            Assert.truthy(filter.length === 1);
        }
        else {
            // If not a function, filter should only be undefined.
            Assert.truthy(filter === undefined || filter === null);
        }
        // 4. Style class
        this.styleClass = styleClass;
    }
    Component.prototype.getStyleClass = function () {
        return this.styleClass;
    };
    Component.prototype.addControl = function (ctrl) {
        var list = this.controls;
        if ($.contains(list, ctrl)) {
            Assert.fail("Control already contained within this component.");
            return;
        }
        this.updateValueAsText();
        ctrl.render();
        list.push(ctrl);
    };
    Component.prototype.removeControl = function (ctrl) {
        var list = this.controls;
        var index = $.indexOf(list, ctrl);
        if (index === -1) {
            Assert.fail("Cannot remove a control that isn't present in the control list.");
            return;
        }
        list.splice(index, 1);
    };
    Component.prototype.updateValueAsText = function () {
        var newValueAsText = this.format(this._value);
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
    };
    Component.prototype.getValueAsText = function () {
        return this.valueAsText;
    };
    Object.defineProperty(Component.prototype, "val", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (typeof value !== "number" || value < 0 || value === 1 / 0 || value !== value) {
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
            var filter = this.filter;
            this._value = filter ? filter(value) : value;
            // Check if a new max value has been reached
            if (value > this.maxValueReached) {
                // Remember new max value
                this.maxValueReached = value;
                // Invoke appropriate listeners
                var listeners = this.maxValueListeners;
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
        },
        enumerable: true,
        configurable: true
    });
    Component.prototype.render = function () {
        var controls = this.controls;
        if (controls.length === 0) {
            // No elements to render
            return;
        }
        var renderRequired = this.updateValueAsText();
        if (!renderRequired) {
            // Textual representation of the current value of
            // the component is the same as the one from the
            // last time the component was rendered, thus
            // re-rendering the attached elements to the same
            // value is not required and can be avoided.
            return;
        }
        for (var i = 0; i < controls.length; i++) {
            controls[i].render();
        }
    };
    Component.prototype.whenReached = function (value, listener) {
        // Validate arguments
        if (typeof value !== "number")
            throw new TypeError("Argument 'value' must be a primitive number.");
        if (value < 0 || value === 1 / 0 || value !== value)
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
        var entry = { value: value, listener: listener };
        var listeners = this.maxValueListeners;
        if (!listeners) {
            // Create the listener array when a listener
            // is added for the first time.
            this.maxValueListeners = [entry];
            return;
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
        }
        else {
            listeners.splice(insertAt, 0, entry);
        }
    };
    return Component;
})();
var AchievementTracker;
(function (AchievementTracker) {
    AchievementTracker.totalAchievements = new Component();
    AchievementTracker.totalUnlocked = new Component();
    var silentUnlock = true;
    function init() {
        HtmlMvc.define("AchievementTracker", AchievementTracker);
        var f = new AchievementFactory();
        f.start("Gold Digger", Game.gold, "Earn <span class='gold-value'>{$}</span>");
        f.make(50, "coin_stack_copper.png");
        f.make(200, "coin_stack_silver.png");
        f.make(500, "coin_stack_gold.png");
        f.make(2500, "coin_stack_blue.png");
        f.make(10000, "coin_stack_purple.png");
        f.end();
        f.start("Spell Caster", SpellBook.totalSpellsCast, "Cast {$} spells.");
        f.make(10, "pointer_stack_copper.png");
        f.make(25, "pointer_stack_silver.png");
        f.make(100, "pointer_stack_gold.png");
        f.make(250, "pointer_stack_blue.png");
        f.make(1000, "pointer_stack_purple.png");
        f.end();
        f.start("Arcane Master", AchievementTracker.totalUnlocked, "Unlock {$} achievements.");
        f.make(10);
        f.make(20);
        f.make(30);
        f.make(40);
        f.make(50);
        f.end();
        f.start("Lord of Mana", Game.totalManaSpent, "Spend a total of {$} mana.");
        f.make(100);
        f.make(250);
        f.make(1000);
        f.make(2500);
        f.make(10000);
        f.end();
        // Init over, disable silent unlocking.
        silentUnlock = false;
    }
    AchievementTracker.init = init;
    var ROMAN_NUMERALS = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    var AchievementFactory = (function () {
        function AchievementFactory() {
        }
        AchievementFactory.prototype.start = function (nameBase, component, description) {
            if (this.started) {
                throw new Error("'end()' must be called before 'start()' can be called again.");
            }
            this.started = true;
            this.nameBase = nameBase;
            this.component = component;
            this.description = description;
            this.count = 1;
        };
        AchievementFactory.prototype.end = function () {
            if (!this.started) {
                throw new Error("'start()' must be called before 'end()' can be called again.");
            }
            this.started = false;
            $.id("achievement-container").appendChild(document.createElement("br"));
        };
        AchievementFactory.prototype.make = function (value, icon) {
            var name = this.nameBase + " " + ROMAN_NUMERALS[this.count++];
            var cmp = this.component;
            var isUnlocked = false;
            ////////////////////////////////////////////////////////////////////////////////////////////////
            // 1. Create the achievement icon that appears in the achievement tab
            ////////////////////////////////////////////////////////////////////////////////////////////////
            var element = document.createElement("div");
            element.className = "achievement";
            if (icon) {
                // If the achievement has a custom icon then show it, otherwise stay with the default icon.
                element.style.backgroundImage = "url('res/achievements/" + icon + "')";
            }
            $.id("achievement-container").appendChild(element);
            ////////////////////////////////////////////////////////////////////////////////////////////////
            // 2. Insert the proper value into the description.
            ////////////////////////////////////////////////////////////////////////////////////////////////
            var description = this.description.replace("{$}", "<b>" + Format.commify(value) + "</b>") + "<br>";
            ////////////////////////////////////////////////////////////////////////////////////////////////
            // 3. Create the tooltip that appears when the player hovers over the achievement icon.
            ////////////////////////////////////////////////////////////////////////////////////////////////
            Tooltip.attachFunc(element, function () {
                // 1
                var stateText = isUnlocked ? 'Unlocked' : 'Locked';
                // 2
                var stateClass = isUnlocked ? 'tooltip-achievement-unlocked' : 'tooltip-achievement-locked';
                // 3
                var progress = Format.commify(cmp.val) + "/" + Format.commify(value);
                return "" +
                    // 1. Title: '{Achievement-name} Locked/Unlocked'
                    ("<div class=\"tooltip-achievement-name\">" + name + " <span class=\"" + stateClass + "\">" + stateText + "</span></div>") +
                    // 2. Textual description of the achievement
                    ("<div>" + description + "</div>") +
                    // 3. Shows the current progress of the achievement towards its completion
                    ("<div class=\"tooltip-achievement-progress\">" + progress + "</div>");
            });
            ////////////////////////////////////////////////////////////////////////////////////////////////
            // 4. Attach the listener to the component, to invoke it when the value of the achievement is reached.
            ////////////////////////////////////////////////////////////////////////////////////////////////
            cmp.whenReached(value, function () {
                Assert.not(isUnlocked);
                isUnlocked = true;
                element.className += " achievement-unlocked";
                AchievementTracker.totalUnlocked.val++;
                if (!silentUnlock) {
                    console.log("Achievement unlocked: " + name);
                    Notification.create("Achievement unlocked: " + name);
                }
            });
            ////////////////////////////////////////////////////////////////////////////////////////////////
            // 5. Increment total achievement count
            ////////////////////////////////////////////////////////////////////////////////////////////////
            AchievementTracker.totalAchievements.val++;
        };
        return AchievementFactory;
    })();
})(AchievementTracker || (AchievementTracker = {}));
var SpellBook;
(function (SpellBook) {
    SpellBook.totalSpellsCast = new Component();
    function init(loadedData) {
        loadedData.readCmp("tc", SpellBook.totalSpellsCast);
        new Spell("Transmute", 5, "transmute.jpg", {
            gives: "Gives <span class='gold-value'>+1</span>",
            description: "A skill long sought after by many, alchemy is an ancient form of " +
                "magic with the power to turn cheap base metals into precious metals – such as silver and gold."
        }, function () { return Game.gold.val += 1; });
        new Spell("Magical Embodiment", 60, "embodiment.png", {
            gives: "Gives <span style='color: #9922ff'>+12 Experience</span>",
            description: "Summons experience (?)"
        }, function () { return Game.currentExp.val += 12; });
    }
    SpellBook.init = init;
    function save(saveTarget) {
        saveTarget.write("tc", SpellBook.totalSpellsCast.val);
    }
    SpellBook.save = save;
    var Spell = (function () {
        function Spell(name, manaCost, icon, tooltip, spellEffect) {
            var element = document.createElement("div");
            element.className = "spell";
            element.style.backgroundImage = "url('res/" + icon + "')";
            element.addEventListener("click", function () {
                if (!Game.spendMana(manaCost)) {
                    // Not enough mana
                    FloatingLabel.create("Not enough mana!", element, Colors.MANA); // todo: avoid getElementById ?
                    return;
                }
                FloatingLabel.create("<span class='mana-value'>" + (-manaCost) + "</span>", element, Colors.MANA); // todo: avoid getElementById ?
                spellEffect();
                SpellBook.totalSpellsCast.val++;
            });
            var tooltipText = ("<div class='tooltip-spell-title'>" + name + " <span class='mana-value'>" + manaCost + "</span></div>") +
                ("<div>" + tooltip.gives + "</div>") +
                ("<div class='tooltip-spell-description'>" + tooltip.description + "</div>");
            Tooltip.attachText(element, tooltipText);
            $.id("spells-container").appendChild(element);
        }
        return Spell;
    })();
})(SpellBook || (SpellBook = {}));
var Options;
(function (Options) {
    /*export let floatingLabels = new GameOption<boolean>(true, {
        element: $.id("options-floating-labels"),
        render: (value: boolean, element: HTMLInputElement) => {
            element.checked = value;
        }
    });*/
    Options.floatingLabelsEnabled = true;
    Options.autoSaveEnabled = true;
    Options.autoSaveInterval = 7000; // ms
    function bindCheckBox(optionName, checkBoxId) {
        Assert.isBool(Options[optionName]);
        var checkBox = $.id(checkBoxId);
        Assert.is(checkBox instanceof HTMLInputElement);
        checkBox.checked = Options[optionName];
        checkBox.addEventListener("change", function (e) {
            Assert.is(e.target === checkBox);
            var checked = e.target.checked;
            Assert.isBool(checked);
            Options[optionName] = checked;
        });
    }
    function init() {
        var floatLabelsCb = $.id("options-floating-labels");
        var autoSaveCb = $.id("options-auto-save");
        var autoSaveIntervalTb = $.id("option-auto-save-interval");
        var autoSaveIntervalApplyBtn = $.id("option-auto-save-apply");
        floatLabelsCb.addEventListener("change", function (e) {
            Options.floatingLabelsEnabled = e.target.checked;
        });
        autoSaveCb.addEventListener("change", function (e) {
            Options.autoSaveEnabled = e.target.checked;
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
        autoSaveIntervalApplyBtn.addEventListener("click", function (e) {
            var interval = Math.floor(Number(autoSaveIntervalTb.value));
            if (interval < 1 || interval !== interval) {
                // Invalid value, return to current value
                autoSaveIntervalTb.value = "" + (Options.autoSaveInterval / 1000);
                return;
            }
            if (interval > 999) {
                // Exceeds maximum value
                interval = 999;
                autoSaveIntervalTb.value = "" + interval;
            }
            Options.autoSaveInterval = interval * 1000;
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
    Options.init = init;
})(Options || (Options = {}));
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
var Game;
(function (Game) {
    // level + exp
    Game.level = new Component(1, null, function (val) {
        Game.nextLevelExp.val = 20 + val * 5;
        return val;
    });
    Game.currentExp = new Component(0, null, function (val) {
        var limit = Game.nextLevelExp.val;
        while (val >= limit) {
            val -= limit;
            levelUp();
        }
        return val;
    });
    Game.nextLevelExp = new Component(25);
    // gold
    Game.gold = new Component(0, null, null, "gold-value");
    Game.goldButtonIncome = new Component(1);
    // mana
    Game.currentMana = new Component(0, null, null, "mana-value");
    Game.manaIncome = new Component(1);
    // stats
    Game.totalTimePlayed = new Component(0, Format.timeSpan);
    Game.totalManaSpent = new Component(0, null, null, "mana-value");
    Game.gameStartTime = new Component();
    // elements
    var goldButton;
    function init(loadedData) {
        if (loadedData) {
            loadedData.readCmp("lv", Game.level);
            loadedData.readCmp("ce", Game.currentExp);
            loadedData.readCmp("gd", Game.gold);
            loadedData.readCmp("tp", Game.totalTimePlayed);
            loadedData.readCmp("st", Game.gameStartTime);
            loadedData.readCmp("mn", Game.currentMana);
            loadedData.readCmp("ms", Game.totalManaSpent);
        }
        goldButton = $.id("gold-button");
        goldButton.addEventListener("mousedown", clickOnGoldButton);
    }
    Game.init = init;
    function spendMana(manaAmount) {
        // todo: assert / typecheck?
        if (Game.currentMana.val < manaAmount) {
            // not enough mana
            return false;
        }
        Game.currentMana.val -= manaAmount;
        Game.totalManaSpent.val += manaAmount;
        return true;
    }
    Game.spendMana = spendMana;
    function levelUp() {
        Game.level.val++;
        Notification.create("You have reached level " + Game.level.val + "!");
    }
    function clickOnGoldButton() {
        var income = Game.goldButtonIncome.val;
        Game.gold.val += income;
        FloatingLabel.create("+" + income, goldButton, Colors.GOLD);
    }
    function update(elapsedMS) {
        Game.currentMana.val += Game.manaIncome.val * (elapsedMS / 1000);
        Game.totalTimePlayed.val += elapsedMS;
    }
    Game.update = update;
    function save(saveTarget) {
        saveTarget.write("lv", Game.level.val);
        saveTarget.write("ce", Game.currentExp.val);
        saveTarget.write("gd", Game.gold.val);
        saveTarget.write("tp", Game.totalTimePlayed.val);
        saveTarget.write("st", Game.gameStartTime.val);
        saveTarget.write("mn", Game.currentMana.val);
        saveTarget.write("ms", Game.totalManaSpent.val);
    }
    Game.save = save;
})(Game || (Game = {}));
(function () {
    window.addEventListener("load", main);
    /**
     * Application entry point.
     */
    function main() {
        // Try to load data from a previous session.
        var loadedData = LoadedData.load(Config.SAVE_KEY);
        // Initialize game related stuff
        Game.init(loadedData);
        SpellBook.init(loadedData);
        AchievementTracker.init();
        Options.init();
        //storage.load();
        // Parse the HTML for the MVC
        HtmlMvc.define("Game", Game);
        HtmlMvc.define("SpellBook", SpellBook);
        HtmlMvc.parseHtml();
        // Show default container
        Display.switchContainer("Spell Book");
        var autoSaveTimer = 0;
        function saveGame() {
            autoSaveTimer = 0;
            var saveTarget = new SaveTarget();
            Game.save(saveTarget);
            SpellBook.save(saveTarget);
            saveTarget.save(Config.SAVE_KEY);
        }
        var firstTick = true;
        var lastTick = Date.now();
        // Handles the timing mechanism of the game.
        function gameLoop() {
            // Calculate elapsed time since last tick
            var now = Date.now();
            var elapsedMS = now - lastTick;
            lastTick = now;
            // Update the game logic
            Game.update(elapsedMS);
            if (Options.autoSaveEnabled) {
                // Auto save feature
                autoSaveTimer += elapsedMS;
                if (autoSaveTimer >= Options.autoSaveInterval) {
                    saveGame();
                    console.log("Game auto saved.");
                }
            }
            // Render the visuals to account for any updated logic
            Display.render();
            // Effects
            FloatingLabel.updateAll(elapsedMS);
            Notification.updateAll(elapsedMS);
            // Init stuff after first tick
            if (firstTick) {
                firstTick = false;
                // Remove the loading mask now that the game is in
                // a valid state after the first update + render.
                var loadingMask = $.id("loading-mask");
                loadingMask.parentNode.removeChild(loadingMask);
                // Enable the save button
                $.id("save-button").addEventListener("click", function () {
                    console.log("Game saved manually.");
                    saveGame();
                });
            }
        }
        // Let the games begin!
        setInterval(gameLoop, 1000 / Config.FRAME_RATE);
    }
})();
/// <reference path="Config.ts" />
/// <reference path="utils/Assert.ts" />
/// <reference path="utils/Format.ts" />
/// <reference path="utils/Tooltip.ts" />
/// <reference path="utils/$.ts" />
/// <reference path="utils/Ensure.ts" />
/// <reference path="utils/LoadedData.ts" />
/// <reference path="utils/SaveTarget.ts" />
/// <reference path="graphics/Display.ts" />
/// <reference path="graphics/DisplayContainer.ts" />
/// <reference path="graphics/DisplayNode.ts" />
/// <reference path="graphics/ProgressBar.ts" />
/// <reference path="graphics/HtmlMvc.ts" />
/// <reference path="graphics/FloatingLabel.ts" />
/// <reference path="graphics/Notification.ts" />
/// <reference path="graphics/Colors.ts" />
/// <reference path="graphics/controls/Control.ts" />
/// <reference path="graphics/controls/LabelControl.ts" />
/// <reference path="graphics/controls/ProgressBarControl.ts" />
/// <reference path="Component.ts" />
/// <reference path="AchievementTracker.ts" />
/// <reference path="SpellBook.ts" />
/// <reference path="Options.ts" />
/// <reference path="Game.ts" />
/// <reference path="main.ts" />
//# sourceMappingURL=game.js.map