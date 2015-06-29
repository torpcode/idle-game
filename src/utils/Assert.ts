/**
 * Provides functions for asserting various conditions.
 */
module Assert {
    /**
     * Assert that a value is primitive boolean `true`.
     */
    export function is(value: any): void {
        if (value !== true) {
            fail("Expected value to be `true`.");
        }
    }

    export function not(value: any): void {
        if (value === true) {
            fail("Expected value to be `false`.");
        }
    }

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
    export function truthy(value: any): void {
        if (!value) {
            fail("Expected value to be truthy.");
        }
    }

    /**
     * Asserts that a value is `falsy`.
     * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy}
     */
    export function falsy(value: any): void {
        if (value) {
            fail("Expected value to be falsy.");
        }
    }

    export function isBool(value: any): void {
        if (typeof value !== "boolean") {
            fail("Expected value to be a boolean.");
        }
    }

    export function isString(value: any): void {
        if (typeof value !== "string") {
            fail("Expected value to be a string.");
        }
    }

    /**
     * Asserts that two values are equal according to the strict equality operator.
     */
    export function equal(a: any, b: any): void {
        if (a !== b) {
            fail("Expected values to be equal.");
        }
    }

    export function isFunc(func: any, argLength?: number): void {
        if (typeof func !== "function") {
            fail("Expected value to be a function.");
        }
        if (typeof argLength === "number") {
            if (func.length !== argLength) {
                fail("Unexpected number of function arguments.")
            }
        }
    }

    export function fail(errorMessage: string): void {
        throw new Error("Assertion error: " + errorMessage);
    }
}