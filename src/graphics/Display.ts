/**
 * Handles the visual state and rendering of the game.
 */
module Display {
    // An object that maps all the display containers to their unique id.
    const containerById: {[id: string]: DisplayContainer}
        = Object.create(null);
    // The display container which is currently visible.
    let currentContainer: DisplayContainer;

    export function switchContainer(containerId: string): void {
        Ensure.isString(containerId);

        // Get new container
        const newContainer = containerById[containerId];
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

    export function createContainer(element: HTMLElement, containerId: string): DisplayContainer {
        // Ensure container id is unique
        if (containerById[containerId]) {
            throw new Error("A DisplayContainer with this id already exists. DisplayContainer ids must be unique.");
        }
        // Create the new container
        const container = new DisplayContainer(containerId, element);
        containerById[containerId] = container;

        return container;
    }

    // The head and tail of a singly-linked-list structure
    // used internally to store display nodes queued for
    // rendering.
    let firstNode: DisplayNode,
        lastNode: DisplayNode;

    export function queueForRender(node: DisplayNode): void {
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
        } else {
            Assert.truthy(lastNode);
            // Render queue is not empty.
            lastNode.nextQueued = node;
            lastNode = node;
        }

        // Invalidate new node
        node.nextQueued = null;
    }

    export function render(): void {
        // Render queued nodes
        let node = firstNode;
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
}