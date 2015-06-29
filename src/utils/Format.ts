module Format {
    const COMMIFY_REGEX = /\B(?=(\d{3})+(?!\d))/g;

    // ToDo: Improve documentation?
    /**
     * Rounds and adds commas to a number.
     */
    export function commify(value: number): string {
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

    /**
     * Converts a time span of milliseconds into a string representation in the format of: `D days, HH:MM:SS`.
     */
    export function timeSpan(milliseconds: number): string {
        let t = milliseconds;
        if (typeof t !== "number" || t < 0 || t === 1/0 || t !== t) {
            Assert.fail("Invalid time span value.");
            return "??:??:??";
        }

        // seconds
        t /= 1000;
        let SS: any = Math.floor(t%60);
        if (SS < 10) SS = "0" + SS;
        // minutes
        t /= 60;
        let MM: any = Math.floor(t%60);
        if (MM < 10) MM = "0" + MM;
        // hours
        t /= 60;
        let HH: any = Math.floor(t%24);
        if (HH < 10) HH = "0" + HH;
        // days
        t /= 24;
        const days: any = Math.floor(t%24);

        return `${days} days, ${HH}:${MM}:${SS}`;
    }

    const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    export function unixToDate(utcMillis: number): string {
        if (utcMillis === undefined) {
            return "Unknown Date";
        }
        if (typeof utcMillis !== "number") {
            Assert.fail("Argument 'utcMillis' must either be undefined or a primitive number.");
            return "Unknown Date"
        }
        const date = new Date(utcMillis);

        // Detect invalid date instances
        const time = date.getTime();
        if (time !== time) {
            Assert.fail("Invalid date.");
            return "Unknown";
        }

        return date.getDay() + " " + MONTHS_SHORT[date.getMonth()] + " " + date.getFullYear();
    }
}