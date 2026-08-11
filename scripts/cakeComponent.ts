import { BlockPermutation, BlockCustomComponent } from "@minecraft/server";

export class EatCakeComponent implements BlockCustomComponent {
  static MAX_BITES = 6;

  onPlayerInteract(event) { 
    const { block, dimension, player } = event;

    // event.player can be undefined (e.g. dispensers), only players can eat
    if (!player) return;

    const bites = block.permutation.getState("relleks_food:bites");

    // feed player
    player.addEffect("saturation", 1, { amplifier: 2, showParticles: false });

    // --- Shrink / consume the block --------------------------------------
    if (bites >= EatCakeComponent.MAX_BITES) {
      // Last bite eaten - the brownie is gone, just like cake.
      dimension.setBlockType(block.location, "minecraft:air");
      return;
    }

    const newPermutation = BlockPermutation.resolve(block.typeId, {
      ...block.permutation.getAllStates(),
      "relleks_food:bites": bites + 1,
    });

    block.setPermutation(newPermutation);
  }
}