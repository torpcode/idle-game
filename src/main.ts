(function () {
    window.addEventListener("load", main);
    /**
     * Application entry point.
     */
    function main(): void {
        // Try to load data from a previous session.
        const loadedData = new StorageDevice(Config.SAVE_KEY);

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

        let autoSaveTimer = 0;
        let firstTick = true;
        let lastTick = Date.now();
        // Handles the timing mechanism of the game.
        function gameLoop() {
            // Calculate elapsed time since last tick
            const now = Date.now();
            const elapsedMS = now - lastTick;
            lastTick = now;

            // Update the game logic
            Game.update(elapsedMS);

            if (Options.autoSaveEnabled) {
                // Auto save feature
                autoSaveTimer += elapsedMS;
                if (autoSaveTimer >= Options.autoSaveInterval) {
                    autoSaveTimer = 0;
                    loadedData.save();
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
                const loadingMask = $.id("loading-mask");
                loadingMask.parentNode.removeChild(loadingMask);

                // Enable the save button
                $.id("save-button").addEventListener("click", () => {
                    autoSaveTimer = 0;
                    loadedData.save();
                    console.log("Game saved manually.")
                });
            }
        }

        // Let the games begin!
        setInterval(gameLoop, 1000/Config.FRAME_RATE);
    }
})();
