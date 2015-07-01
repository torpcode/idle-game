module SpellBook {
    export const totalSpellsCast = new Component();

    export function init(storage: StorageDevice): void {
        storage.bindCmp("tc", totalSpellsCast);

        new Spell("Transmute", 5, "transmute.jpg", {
            gives: "Gives <span class='gold-value'>+1</span>",
            description: "A skill long sought after by many, alchemy is an ancient form of " +
            "magic with the power to turn cheap base metals into precious metals – such as silver and gold."
        }, () => Game.gold.val += 1);
        new Spell("Magical Embodiment", 60, "embodiment.png", {
            gives: "Gives <span style='color: #9922ff'>+12 Experience</span>",
            description: "Summons experience (?)"
        }, () => Game.currentExp.val += 12);
    }

    class Spell {
        constructor(name: string, manaCost: number, icon: string, tooltip: { gives: string; description: string; }, spellEffect: ()=>void) {
            const element = document.createElement("div");
            element.className = "spell";
            element.style.backgroundImage = "url('res/" + icon + "')";
            element.addEventListener("click", () => {
                if (!Game.spendMana(manaCost)) {
                    // Not enough mana
                    FloatingLabel.create("Not enough mana!", element, Colors.MANA); // todo: avoid getElementById ?
                    return;
                }
                FloatingLabel.create("<span class='mana-value'>" + (-manaCost) + "</span>", element, Colors.MANA); // todo: avoid getElementById ?

                spellEffect();
                totalSpellsCast.val++;
            });

            const tooltipText = `<div class='tooltip-spell-title'>${name} <span class='mana-value'>${manaCost}</span></div>` +
                `<div>${tooltip.gives}</div>` +
                `<div class='tooltip-spell-description'>${tooltip.description}</div>`;

            Tooltip.attachText(element, tooltipText);
            $.id("spells-container").appendChild(element);
        }
    }
}