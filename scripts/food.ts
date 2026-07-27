import { world, system } from "@minecraft/server";

/*
Different food items are grouped into different well fed levels. The
higher the well fed level, the more powerful the buffs the player will receive.
*/
const WELLFED1 = [
  "minecraft:apple"
]
const WELLFED2 = [
    "minecraft:cooked_beef"
]
const WELLFED3 = [
    "minecraft:mushroom_stew"
]
const WELLFED4 = [
    ""
]
const WELLFED5 = [
    ""
]

/*
Checks if the player has consumed a food item. If they have, and their hunger level is full,
then it tags the player with the corresponding well fed tag.
*/
world.afterEvents.itemCompleteUse.subscribe((event) => {
    const player = event.source;
    const itemID = event.itemStack.typeId;

    if (!player || !itemID) return;

    if (WELLFED1.includes(itemID)) {
        system.runTimeout(() => {
            if (checkFullness(player)) {
                player.runCommand("tag @s add well_fed_1");
            }
        }, 2);  // 2 tick delay to ensure the hunger value is updated before checking fullness
    }
    else if (WELLFED2.includes(itemID)) {
        system.runTimeout(() => {
            if (checkFullness(player)) {
                player.runCommand("tag @s add well_fed_2");
            }
        }, 2);
    }
    else if (WELLFED3.includes(itemID)) {
        system.runTimeout(() => {
            if (checkFullness(player)) {
                player.runCommand("tag @s add well_fed_3");
            }
        }, 2);
    }
    else if (WELLFED4.includes(itemID)) {
        system.runTimeout(() => {
            if (checkFullness(player)) {
                player.runCommand("tag @s add well_fed_4");
            }
        }, 2);
    }
    else if (WELLFED5.includes(itemID)) {
        system.runTimeout(() => {
            if (checkFullness(player)) {
                player.runCommand("tag @s add well_fed_5");
            }
        }, 2);
    }
});

/*
Checks if the given player's hunger level is full. If it is, return true, otherwise return false.
*/
function checkFullness(player): boolean{
    const playerHunger = player.getComponent("minecraft:player.hunger");
    const currentHunger = Math.ceil(playerHunger.currentValue);

    if (currentHunger >= 20) {
        return true;
    }
    return false;
}

/*
Applies the regeneration effect to players with the well_fed_1 tag every 4 seconds.
*/
function applyWellFed1Effects() {
    for (const player of world.getPlayers()) {
        if (player.hasTag("well_fed_1")) {
            player.runCommand("effect @s regeneration 3 0 true");
        }
    }
}

/*
Applies the regeneration effect to players with the well_fed_2 tag every 2 seconds.
*/
function applyWellFed2Effects() {
    for (const player of world.getPlayers()) {
        if (player.hasTag("well_fed_2")) {
            player.runCommand("effect @s regeneration 3 0 true");
        }
    }
}

/*
Removes well fed tags from players who are not full every second.
For players who are full, applies the appropriate well fed effects based on their well fed tag 
for well fed modifiers 3 through 5 every second.
*/
function applyWellFedEffects() {
    for (const player of world.getPlayers()) {
        if (!checkFullness(player)) {
            player.runCommand("tag @s remove well_fed_1");
            player.runCommand("tag @s remove well_fed_2");
            player.runCommand("tag @s remove well_fed_3");
            player.runCommand("tag @s remove well_fed_4");
            player.runCommand("tag @s remove well_fed_5");
            return;  // Skip applying effects if the player is not full
        }

        if (player.hasTag("well_fed_3")) {
            player.runCommand("effect @s regeneration 2 2 true");
            player.runCommand("effect @s haste 1 0 true");
        }
        else if (player.hasTag("well_fed_4")){
            player.runCommand("effect @s regeneration 1 3 true");
            player.runCommand("effect @s haste 1 0 true");
        }
        else if (player.hasTag("well_fed_5")){
            player.runCommand("effect @s regeneration 1 4 true");
            player.runCommand("effect @s haste 1 0 true");
        }
    }
}



system.runInterval(applyWellFed1Effects, 80);  // Run the function every 80 ticks (4 seconds)
system.runInterval(applyWellFed2Effects, 40);  // Run the function every 40 ticks (2 seconds)
system.runInterval(applyWellFedEffects, 20);  // Run the function every 20 ticks (1 second)

