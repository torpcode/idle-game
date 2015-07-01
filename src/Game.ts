module Game {
    // level + exp
    export const level = new Component(1, null, val => {
        nextLevelExp.val = 20 + val*5;
        return val;
    });
    export const currentExp = new Component(0, null, val => {
        const limit = nextLevelExp.val;
        while (val >= limit) {
            val -= limit;
            levelUp();
        }
        return val;
    });
    export const nextLevelExp = new Component(25);
    // gold
    export const gold = new Component(0, null, null, "gold-value");
    export const goldButtonIncome = new Component(1);
    // mana
    export const currentMana = new Component(0, null, null, "mana-value");
    export const manaIncome = new Component(1);

    // stats
    export const totalTimePlayed = new Component(0, Format.timeSpan);
    export const totalManaSpent = new Component(0, null, null, "mana-value");
    export const gameStartTime = new Component();

    // elements
    let goldButton: HTMLElement;

    export function init(storage: StorageDevice): void {
        storage.bindCmp("lv", level);
        storage.bindCmp("ce", currentExp);
        storage.bindCmp("gd", gold);
        storage.bindCmp("tp", totalTimePlayed);
        storage.bindCmp("st", gameStartTime);
        storage.bindCmp("mn", currentMana);
        storage.bindCmp("ms", totalManaSpent);

        goldButton = $.id("gold-button");
        goldButton.addEventListener("mousedown", clickOnGoldButton);
    }

    export function spendMana(manaAmount: number): boolean {
        // todo: assert / typecheck?

        if (currentMana.val < manaAmount) {
            // not enough mana
            return false;
        }

        currentMana.val -= manaAmount;
        totalManaSpent.val += manaAmount;
        return true;
    }

    function levelUp(): void {
        level.val++;
        Notification.create("You have reached level " + level.val + "!");
    }

    function clickOnGoldButton(): void {
        const income = goldButtonIncome.val;
        gold.val += income;
        FloatingLabel.create("+" + income, goldButton, Colors.GOLD);
    }

    export function update(elapsedMS: number): void {
        currentMana.val += manaIncome.val*(elapsedMS/1000);
        totalTimePlayed.val += elapsedMS;
    }
}

