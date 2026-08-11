import { Block, BlockComponentPlayerInteractEvent, BlockComponentRandomTickEvent, BlockCustomComponent, 
    EntityInventoryComponent, Player, } from "@minecraft/server";
import { BlockStateSuperset } from "@minecraft/vanilla-data";

export class CropGrowthComponent implements BlockCustomComponent {
  static tryGrowBlock(block: Block) {
    const permutation = block.permutation;
    const age = permutation.getState("relleks_food:crop_age" as keyof BlockStateSuperset);
    if (age === undefined || typeof age !== "number") {
      return;
    }

    if (age === 4) {
      return; // already at max age
    }

    block.setPermutation(permutation.withState("relleks_food:crop_age" as keyof BlockStateSuperset, age + 1));
  }

  static tryFertilize(block: Block, player: Player): boolean {
    const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
    if (inventory === undefined || block.permutation === 4) {
      return false;
    }

    const selectedItem = inventory.container?.getItem(player.selectedSlotIndex);
    if (selectedItem && selectedItem.typeId === "minecraft:bone_meal") {
      CropGrowthComponent.tryGrowBlock(block);
      selectedItem.amount--;
      inventory.container?.setItem(player.selectedSlotIndex, selectedItem);
      return true;
    }
    return false;
  }

  onRandomTick(arg: BlockComponentRandomTickEvent) {
    CropGrowthComponent.tryGrowBlock(arg.block);
  }

  // fertilization growth with bone meal
  onPlayerInteract(arg: BlockComponentPlayerInteractEvent) {
    if (arg.player === undefined) {
      return;
    }

    CropGrowthComponent.tryFertilize(arg.block, arg.player);
  }
}