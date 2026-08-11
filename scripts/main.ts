import { system } from "@minecraft/server";

import "./food.ts";
import "./hot_potato.ts";

//components
import { EatCakeComponent } from "./cakeComponent.ts";
import { BlockEffectComponent } from "./blockEffectComponent.ts";
import { HarvestBerryComponent } from "./harvestBerryComponent.ts"
import { CropGrowthComponent } from "./cropGrowthComponent.ts"
import { ItemEffectComponent } from "./itemEffectComponent.ts";

system.beforeEvents.startup.subscribe((initEvent) => {
  // block
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:eat_cake", new EatCakeComponent());
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:block_effect", new BlockEffectComponent());
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:harvest_berry", new HarvestBerryComponent());
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:crop_grow", new CropGrowthComponent());

  //item
  initEvent.itemComponentRegistry.registerCustomComponent("relleks_food:item_effect", new ItemEffectComponent());
});