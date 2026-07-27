import { world, system } from "@minecraft/server";
/*
Different food items are grouped into different well fed levels. The
higher the well fed level, the more powerful the buffs the player will receive.
*/
const WELLFED1 = [
    "minecraft:apple"
];
const WELLFED2 = [
    "minecraft:cooked_beef"
];
const WELLFED3 = [
    "minecraft:mushroom_stew"
];
/*
Checks if the player has consumed a food item. If they have, and their hunger level is full,
then it tags the player with the corresponding well fed tag.
*/
world.afterEvents.itemCompleteUse.subscribe((event) => {
    const player = event.source;
    const itemID = event.itemStack.typeId;
    if (!player || !itemID)
        return;
    if (WELLFED1.includes(itemID)) {
        system.runTimeout(() => {
            if (checkFullness(player)) {
                player.runCommand("tag @s add well_fed_1");
            }
        }, 2); // 2 tick delay to ensure the hunger value is updated before checking fullness
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
});
/*
Checks if the given player's hunger level is full. If it is, return true, otherwise return false.
*/
function checkFullness(player) {
    const playerHunger = player.getComponent("minecraft:player.hunger");
    const currentHunger = Math.ceil(playerHunger.currentValue);
    if (currentHunger >= 20) {
        return true;
    }
    return false;
}
function applyWellFedEffects() {
    for (const player of world.getPlayer()) {
        if (!checkFullness(player)) {
            player.runCommand("tag @s remove well_fed_1");
            player.runCommand("tag @s remove well_fed_2");
            player.runCommand("tag @s remove well_fed_3");
            return; // Skip applying effects if the player is not full
        }
        if (player.hasTag("well_fed_1")) {
            player.runCommand("effect @s minecraft:regeneration 3 0 true");
        }
        else if (player.hasTag("well_fed_2")) {
            player.runCommand("effect @s minecraft:regeneration 3 1 true");
        }
        else if (player.hasTag("well_fed_3")) {
            player.runCommand("effect @s minecraft:regeneration 2 2 true");
        }
    }
}
system.runInterval(applyWellFedEffects, 20); // Run the function every 20 ticks (1 second)
