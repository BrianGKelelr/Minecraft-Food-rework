// ct:/main.js
import { system as system5 } from "@minecraft/server";

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

// ct:./hot_potato.ts
import { system as system2, world as world2, EntityComponentTypes, EntityDamageCause } from "@minecraft/server";
var armedPlayers = /* @__PURE__ */ new Set();
world2.afterEvents.playerInventoryItemChange.subscribe((event) => {
  const { player, itemStack, beforeItemStack } = event;
  if (itemStack?.typeId !== "relleks_food:hot_potato") {
    return;
  }
  if (beforeItemStack?.typeId === "relleks_food:hot_potato") {
    return;
  }
  if (armedPlayers.has(player.id)) {
    return;
  }
  armedPlayers.add(player.id);
  player.setOnFire(10, true);
  system2.runTimeout(() => {
    armedPlayers.delete(player.id);
    if (!player) return;
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    if (!inventory?.container) return;
    const container = inventory.container;
    for (let slot = 0; slot < container.size; slot++) {
      const item = container.getItem(slot);
      if (item?.typeId === "relleks_food:hot_potato") {
        explode(player);
        break;
      }
    }
  }, 200);
});
function explode(target) {
  if (!target) {
    return;
  }
  target.dimension.createExplosion(target.location, 2, {
    breaksBlocks: false,
    causesFire: false,
    allowUnderwater: true,
    source: target
  });
  target.applyDamage(255, { cause: EntityDamageCause.entityExplosion });
}

// ct:./cakeComponent.ts
import { BlockPermutation } from "@minecraft/server";
var EatCakeComponent = class _EatCakeComponent {
  static MAX_BITES = 6;
  onPlayerInteract(event) {
    const { block, dimension, player } = event;
    if (!player) return;
    const bites = block.permutation.getState("relleks_food:bites");
    player.addEffect("saturation", 1, { amplifier: 2, showParticles: false });
    if (bites >= _EatCakeComponent.MAX_BITES) {
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

// ct:./blockEffectComponent.ts
import { system as system3 } from "@minecraft/server";
var BlockEffectComponent = class {
  onPlayerInteract(event, params) {
    const { player } = event;
    const { effect, tickDuration, amplifier, tickDelay } = params.params;
    system3.runTimeout(() => {
      player.addEffect(effect, tickDuration, { amplifier, showParticles: true });
    }, tickDelay);
  }
};

// ct:./harvestBerryComponent.ts
var HarvestBerryComponent = class {
  onPlayerInteract(arg, params) {
    if (arg.player === void 0) {
      return;
    }
    const { lootTable, resetAge } = params.params;
    const pos = arg.block.location;
    arg.dimension.runCommand(`loot spawn ${pos.x} ${pos.y} ${pos.z} loot "${lootTable}"`);
    arg.block.setPermutation(arg.block.permutation.withState("relleks_food:crop_age", resetAge));
  }
};

// ct:./cropGrowthComponent.ts
import {
  EntityInventoryComponent as EntityInventoryComponent2
} from "@minecraft/server";
var CropGrowthComponent = class _CropGrowthComponent {
  static tryGrowBlock(block) {
    const permutation = block.permutation;
    const age = permutation.getState("relleks_food:crop_age");
    if (age === void 0 || typeof age !== "number") {
      return;
    }
    if (age === 4) {
      return;
    }
    block.setPermutation(permutation.withState("relleks_food:crop_age", age + 1));
  }
  static tryFertilize(block, player) {
    const inventory = player.getComponent(EntityInventoryComponent2.componentId);
    if (inventory === void 0 || block.permutation === 4) {
      return false;
    }
    const selectedItem = inventory.container?.getItem(player.selectedSlotIndex);
    if (selectedItem && selectedItem.typeId === "minecraft:bone_meal") {
      _CropGrowthComponent.tryGrowBlock(block);
      if (selectedItem.amount > 1) {
        selectedItem.amount--;
        inventory.container?.setItem(player.selectedSlotIndex, selectedItem);
        return true;
      } else {
        inventory.container?.setItem(player.selectedSlotIndex, void 0);
        return true;
      }
    }
    return false;
  }
  onRandomTick(arg) {
    _CropGrowthComponent.tryGrowBlock(arg.block);
  }
  // fertilization growth with bone meal
  onPlayerInteract(arg) {
    if (arg.player === void 0) {
      return;
    }
    _CropGrowthComponent.tryFertilize(arg.block, arg.player);
  }
};

// ct:./itemEffectComponent.ts
import { system as system4 } from "@minecraft/server";
var ItemEffectComponent = class {
  onConsume(arg, params) {
    const raw = params.params;
    const effects = Array.isArray(raw) ? raw : [raw];
    for (const { effect, tickDuration, amplifier, tickDelay } of effects) {
      system4.runTimeout(() => {
        if (!arg.source) {
          return;
        }
        arg.source.addEffect(effect, tickDuration, { amplifier, showParticles: true });
      }, tickDelay);
    }
  }
};

// ct:/main.js
system5.beforeEvents.startup.subscribe((initEvent) => {
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:eat_cake", new EatCakeComponent());
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:block_effect", new BlockEffectComponent());
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:harvest_berry", new HarvestBerryComponent());
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:crop_grow", new CropGrowthComponent());
  initEvent.itemComponentRegistry.registerCustomComponent("relleks_food:item_effect", new ItemEffectComponent());
});
