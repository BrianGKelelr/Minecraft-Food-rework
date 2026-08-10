var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

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
var WELLFED1, WELLFED2, WELLFED3, WELLFED4, WELLFED5;
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
    WELLFED4 = [
      ""
    ];
    WELLFED5 = [
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
    system.runInterval(applyWellFed1Effects, 80);
    system.runInterval(applyWellFed2Effects, 40);
    system.runInterval(applyWellFedEffects, 20);
  }
});

// ct:./brownie.ts
var require_brownie = __commonJS({
  "ct:./brownie.ts"() {
  }
});

// ct:/main.js
import { world as world2 } from "@minecraft/server";
world2.afterEvents.worldLoad.subscribe(() => {
  Promise.resolve().then(() => init_food());
  Promise.resolve().then(() => __toESM(require_brownie()));
});
