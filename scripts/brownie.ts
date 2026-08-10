import { system, BlockPermutation } from "@minecraft/server";

const MAX_BITES = 6; // matches the highest value in "relleks_food:bites" -> brownie7 (one bite left)

/** @type {import("@minecraft/server").BlockCustomComponent} */
const EatBrownieComponent = {
  onPlayerInteract(event, params) { const { block, dimension, player } = event;

    // event.player can be undefined (e.g. dispensers), only players can eat
    if (!player) return;

    const bites = block.permutation.getState("relleks_food:bites");

    // apply brownie effect to player
    const { effect, duration, amplifier } = params.params;
    player.addEffect(effect, duration, { amplifier: amplifier, showParticles: true });

    // feed player
    player.addEffect("saturation", 1, { amplifier: 2, showParticles: false });

    // --- Shrink / consume the block --------------------------------------
    if (bites >= MAX_BITES) {
      // Last bite eaten - the brownie is gone, just like cake.
      dimension.setBlockType(block.location, "minecraft:air");
      return;
    }

    const newPermutation = BlockPermutation.resolve(block.typeId, {
      ...block.permutation.getAllStates(),
      "relleks_food:bites": bites + 1,
    });

    block.setPermutation(newPermutation);
  },
};

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "relleks_food:eat_brownie",
    EatBrownieComponent
  );
});