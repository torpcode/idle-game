interface DisplayNode {
    render(): void;
    isQueuedForRender: boolean;
    nextQueued: DisplayNode;
}