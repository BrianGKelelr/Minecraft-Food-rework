import { BlockComponentPlayerInteractEvent, BlockComponentTickEvent, BlockCustomComponent } from "@minecraft/server";
import { CropGrowthComponent } from "./CropGrowthComponent";
import { BlockStateSuperset } from "@minecraft/vanilla-data";

export class GrownLanternberryCropComponent implements BlockCustomComponent {
  onPlayerInteract(arg: BlockComponentPlayerInteractEvent) {
    if (arg.player === undefined) {
      return;
    }

    // harvest the block and replant it
    const pos = arg.block.location;
    arg.dimension.runCommand(`loot spawn ${pos.x} ${pos.y} ${pos.z} loot "crops/lanternberry_grown_crop"`);
    arg.block.setPermutation(arg.block.permutation.withState("relleks_food:crop_age" as keyof BlockStateSuperset, 2));
  }
}