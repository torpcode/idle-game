module AchievementTracker {
    export const totalAchievements = new Component();
    export const totalUnlocked = new Component();

    let silentUnlock = true;

    export function init(): void {
        HtmlMvc.define("AchievementTracker", AchievementTracker);

        const f = new AchievementFactory();

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

        f.start("Arcane Master", totalUnlocked, "Unlock {$} achievements.");
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

    const ROMAN_NUMERALS = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

    class AchievementFactory {
        private nameBase: string;
        private component: Component;
        private description: string;
        private count: number;
        private started: boolean;

        public start(nameBase: string, component: Component, description: string): void {
            if (this.started) {
                throw new Error("'end()' must be called before 'start()' can be called again.");
            }
            this.started = true;

            this.nameBase = nameBase;
            this.component = component;
            this.description = description;
            this.count = 1;
        }

        public end(): void {
            if (!this.started) {
                throw new Error("'start()' must be called before 'end()' can be called again.");
            }
            this.started = false;
            $.id("achievement-container").appendChild(document.createElement("br"));
        }

        public make(value: number, icon?: string): void {
            const name = this.nameBase + " " + ROMAN_NUMERALS[this.count++];
            const cmp = this.component;
            let isUnlocked = false;

            ////////////////////////////////////////////////////////////////////////////////////////////////
            // 1. Create the achievement icon that appears in the achievement tab
            ////////////////////////////////////////////////////////////////////////////////////////////////
            const element = document.createElement("div");
            element.className = "achievement";
            if (icon) {
                // If the achievement has a custom icon then show it, otherwise stay with the default icon.
                element.style.backgroundImage = "url('res/achievements/" + icon + "')";
            }
            $.id("achievement-container").appendChild(element);

            ////////////////////////////////////////////////////////////////////////////////////////////////
            // 2. Insert the proper value into the description.
            ////////////////////////////////////////////////////////////////////////////////////////////////
            const description = this.description.replace("{$}", `<b>${Format.commify(value)}</b>`) + "<br>";

            ////////////////////////////////////////////////////////////////////////////////////////////////
            // 3. Create the tooltip that appears when the player hovers over the achievement icon.
            ////////////////////////////////////////////////////////////////////////////////////////////////
            Tooltip.attachFunc(element, () => {
                // 1
                let stateText = isUnlocked ? 'Unlocked' : 'Locked';
                // 2
                let stateClass = isUnlocked ? 'tooltip-achievement-unlocked' : 'tooltip-achievement-locked';
                // 3
                let progress = Format.commify(cmp.val) + "/" + Format.commify(value);
                return `` +
                        // 1. Title: '{Achievement-name} Locked/Unlocked'
                    `<div class="tooltip-achievement-name">${name} <span class="${stateClass}">${stateText}</span></div>` +
                        // 2. Textual description of the achievement
                    `<div>${description}</div>` +
                        // 3. Shows the current progress of the achievement towards its completion
                    `<div class="tooltip-achievement-progress">${progress}</div>`;
            });

            ////////////////////////////////////////////////////////////////////////////////////////////////
            // 4. Attach the listener to the component, to invoke it when the value of the achievement is reached.
            ////////////////////////////////////////////////////////////////////////////////////////////////
            cmp.whenReached(value, () => {
                Assert.not(isUnlocked);

                isUnlocked = true;
                element.className += " achievement-unlocked";
                totalUnlocked.val++;

                if (!silentUnlock) {
                    console.log("Achievement unlocked: " + name);
                    Notification.create("Achievement unlocked: " + name);
                }
            });

            ////////////////////////////////////////////////////////////////////////////////////////////////
            // 5. Increment total achievement count
            ////////////////////////////////////////////////////////////////////////////////////////////////
            totalAchievements.val++;
        }
    }
}