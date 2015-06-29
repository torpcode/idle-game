/**
 * Represents a visual control.
 */
interface Control {
    /**
     * Called when the control becomes visible.
     */
    show(): void;
    /**
     * Called when the control becomes hidden.
     */
    hide(): void;
    /**
     * Called when the visuals of the control should be updated.
     */
    render(): void;
}