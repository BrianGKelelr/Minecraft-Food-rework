var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// ct:./food.ts
var food_exports = {};
import { world, system } from "@minecraft/server";
function checkFullness(player) {
  const playerHunger = player.getComponent("minecraft:player.hunger");
  const currentHunger = Math.ceil(playerHunger.currentValue);
  if (currentHunger >= 20) {
    return true;
  }
  return false;
}
function applyWellFedEffects() {
  for (const player of world.getPlayers()) {
    if (!checkFullness(player)) {
      player.runCommand("tag @s remove well_fed_1");
      player.runCommand("tag @s remove well_fed_2");
      player.runCommand("tag @s remove well_fed_3");
      return;
    }
    if (player.hasTag("well_fed_1")) {
      player.runCommand("effect @s regeneration 3 0 true");
    } else if (player.hasTag("well_fed_2")) {
      player.runCommand("effect @s regeneration 3 1 true");
      player.runCommand("effect @s haste 1 0 true");
    } else if (player.hasTag("well_fed_3")) {
      player.runCommand("effect @s regeneration 2 2 true");
      player.runCommand("effect @s haste 1 1 true");
    }
  }
}
var WELLFED1, WELLFED2, WELLFED3;
var init_food = __esm({
  "ct:./food.ts"() {
    WELLFED1 = [
      "minecraft:apple"
    ];
    WELLFED2 = [
      "minecraft:cooked_beef"
    ];
    WELLFED3 = [
      "minecraft:mushroom_stew"
    ];
    world.afterEvents.itemCompleteUse.subscribe((event) => {
      const player = event.source;
      const itemID = event.itemStack.typeId;
      if (!player || !itemID) return;
      if (WELLFED1.includes(itemID)) {
        system.runTimeout(() => {
          if (checkFullness(player)) {
            player.runCommand("tag @s add well_fed_1");
          }
        }, 2);
      } else if (WELLFED2.includes(itemID)) {
        system.runTimeout(() => {
          if (checkFullness(player)) {
            player.runCommand("tag @s add well_fed_2");
          }
        }, 2);
      } else if (WELLFED3.includes(itemID)) {
        system.runTimeout(() => {
          if (checkFullness(player)) {
            player.runCommand("tag @s add well_fed_3");
          }
        }, 2);
      }
    });
    system.runInterval(applyWellFedEffects, 60);
  }
});

// ct:/main.js
import { world as world2 } from "@minecraft/server";
world2.afterEvents.worldLoad.subscribe(() => {
  Promise.resolve().then(() => init_food());
});
