import { world, system } from "@minecraft/server";

/*
Different food items are grouped into different well fed levels. The
higher the well fed level, the more powerful the buffs the player will receive.
*/
const WELLFED1 = [
    "minecraft:apple", "minecraft:beetroot", "minecraft:carrot", 
    "minecraft:chorus_fruit", "minecraft:dried_kelp", "minecraft:glow_berries",
    "minecraft:melon_slice", "minecraft:potato", "minecraft:raw_beef",
    "minecraft:raw_chicken", "minecraft:raw_cod", "minecraft:raw_mutton", 
    "minecraft:raw_porkchop", "minecraft:raw_rabbit", "minecraft:raw_salmon", 
    "minecraft:sweet_berries", "minecraft:tropical_fish", "relleks_food:sniffer_meat"
]
const WELLFED2 = [
    "minecraft:baked_potato", "minecraft:beetroot_soup", "minecraft:bread", 
    "minecraft:cooked_chicken", "minecraft:cooked_cod", "minecraft:cooked_mutton", 
    "minecraft:cooked_porkchop", "minecraft:cooked_rabbit", "minecraft:cooked_slamon", 
    "minecraft:cookie", "minecraft:honey_bottle", "minecraft:mushroom_stew", 
    "minecraft:cooked_beef", "relleks_food:jello", "relleks_food:jello_salad", 
    "relleks_food:lanternberry", "relleks_food:popped_pitcher_pod", "relleks_food:sniffer_meat_cooked", 
    "relleks_food:sushi"
]
const WELLFED3 = [
    "minecraft:cake", "minecraft:golden_apple", "minecraft:enchanted_golden_apple", 
    "minecraft:golden_carrot", "minecraft:pumpkin_pie", "minecraft:rabbit_stew", 
    "minecraft:suspicious_stew", "relleks_food:beef_stew", "relleks_food:fruit_salad", 
    "relleks_food:ice_cream_chocolate", "relleks_food:ice_cream", "relleks_food:lanternberry_golden", 
    "relleks_food:meatloaf", "relleks_food:mutton_stew", "relleks_food:vegetable_soup"
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
Removes well fed tags from players who are not full every second.
For players who are full, applies the appropriate well fed effects based on their well fed tag 
*/
function applyWellFedEffects() {
    for (const player of world.getPlayers()) {
        if (!checkFullness(player)) {
            player.runCommand("tag @s remove well_fed_1");
            player.runCommand("tag @s remove well_fed_2");
            player.runCommand("tag @s remove well_fed_3");
            player.runCommand("tag @s remove well_fed_4");
            player.runCommand("tag @s remove well_fed_5");
            return;
        }

        if (player.hasTag("well_fed_1")){
            player.runCommand("effect @s regeneration 1 0 true");
        }
        else if (player.hasTag("well_fed_2")){
            player.runCommand("effect @s regeneration 1 0 true");
            player.runCommand("effect @s speed 1 0 true");
        }
        else if (player.hasTag("well_fed_3")){
            player.runCommand("effect @s regeneration 1 1 true");
            player.runCommand("effect @s speed 1 0 true");
            player.runCommand("effect @s resistance 1 0 true");
        }
        else if (player.hasTag("well_fed_4")){
            player.runCommand("effect @s regeneration 1 2 true");
            player.runCommand("effect @s haste 1 0 true");
            player.runCommand("effect @s speed 1 1 true");
            player.runCommand("effect @s resistance 1 1 true");
        }
        else if (player.hasTag("well_fed_5")){
            player.runCommand("effect @s regeneration 1 3 true");
            player.runCommand("effect @s haste 1 1 true");
            player.runCommand("effect @s speed 1 1 true");
            player.runCommand("effect @s resistance 1 2 true");
        }
    }
}

system.runInterval(applyWellFedEffects, 20);  // Run the function every 20 ticks (1 second)

