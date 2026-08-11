import { BlockComponentPlayerInteractEvent, BlockComponentTickEvent, BlockCustomComponent } from "@minecraft/server";
import { BlockStateSuperset } from "@minecraft/vanilla-data";

export class HarvestBerryComponent implements BlockCustomComponent {

  onPlayerInteract(arg: BlockComponentPlayerInteractEvent, params) {
    if (arg.player === undefined) {
      return;
    }

    const { lootTable, resetAge } = params.params;

    // harvest the block and replant it
    const pos = arg.block.location;
    arg.dimension.runCommand(`loot spawn ${pos.x} ${pos.y} ${pos.z} loot "${lootTable}"`);
    arg.block.setPermutation(arg.block.permutation.withState("relleks_food:crop_age" as keyof BlockStateSuperset, resetAge));
  }
}