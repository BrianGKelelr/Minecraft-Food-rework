// ct:./food.ts
import { world, system } from "@minecraft/server";
var WELLFED1 = [
  "minecraft:apple"
];
var WELLFED2 = [
  "minecraft:cooked_beef"
];
var WELLFED3 = [
  "minecraft:mushroom_stew"
];
var WELLFED4 = [
  ""
];
var WELLFED5 = [
  ""
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
  } else if (WELLFED4.includes(itemID)) {
    system.runTimeout(() => {
      if (checkFullness(player)) {
        player.runCommand("tag @s add well_fed_4");
      }
    }, 2);
  } else if (WELLFED5.includes(itemID)) {
    system.runTimeout(() => {
      if (checkFullness(player)) {
        player.runCommand("tag @s add well_fed_5");
      }
    }, 2);
  }
});
function checkFullness(player) {
  const playerHunger = player.getComponent("minecraft:player.hunger");
  const currentHunger = Math.ceil(playerHunger.currentValue);
  if (currentHunger >= 20) {
    return true;
  }
  return false;
}
function applyWellFed1Effects() {
  for (const player of world.getPlayers()) {
    if (player.hasTag("well_fed_1")) {
      player.runCommand("effect @s regeneration 3 0 true");
    }
  }
}
function applyWellFed2Effects() {
  for (const player of world.getPlayers()) {
    if (player.hasTag("well_fed_2")) {
      player.runCommand("effect @s regeneration 3 0 true");
    }
  }
}
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
    if (player.hasTag("well_fed_3")) {
      player.runCommand("effect @s regeneration 2 2 true");
      player.runCommand("effect @s haste 1 0 true");
    } else if (player.hasTag("well_fed_4")) {
      player.runCommand("effect @s regeneration 1 3 true");
      player.runCommand("effect @s haste 1 0 true");
    } else if (player.hasTag("well_fed_5")) {
      player.runCommand("effect @s regeneration 1 4 true");
      player.runCommand("effect @s haste 1 0 true");
    }
  }
}
system.runInterval(applyWellFed1Effects, 80);
system.runInterval(applyWellFed2Effects, 40);
system.runInterval(applyWellFedEffects, 20);

// ct:./brownie.ts
import { system as system2, BlockPermutation } from "@minecraft/server";
var MAX_BITES = 6;
var EatBrownieComponent = {
  onPlayerInteract(event, params) {
    const { block, dimension, player } = event;
    if (!player) return;
    const bites = block.permutation.getState("relleks_food:bites");
    const { effect, duration, amplifier } = params.params;
    player.addEffect(effect, duration, { amplifier, showParticles: true });
    player.addEffect("saturation", 1, { amplifier: 1, showParticles: false });
    if (bites >= MAX_BITES) {
      dimension.setBlockType(block.location, "minecraft:air");
      return;
    }
    const newPermutation = BlockPermutation.resolve(block.typeId, {
      ...block.permutation.getAllStates(),
      "relleks_food:bites": bites + 1
    });
    block.setPermutation(newPermutation);
  }
};
system2.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "relleks_food:eat_brownie",
    EatBrownieComponent
  );
});
