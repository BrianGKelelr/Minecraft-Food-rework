import { system } from "@minecraft/server";

import "./food.ts";
import "./hot_potato.ts";

//components
import { EatCakeComponent } from "./cakeComponent.ts";
import { BlockEffectComponent } from "./blockEffectComponent.ts";
import { GrownLanternberryCropComponent } from "./grownLanternberryCropComponent.ts"
import { CropGrowthComponent } from "./cropGrowthComponent.ts"

system.beforeEvents.startup.subscribe((initEvent) => {
  // block
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:eat_cake", new EatCakeComponent());
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:block_effect", new BlockEffectComponent());
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:lanternberry_grown", new GrownLanternberryCropComponent());
  initEvent.blockComponentRegistry.registerCustomComponent("relleks_food:crop_grow", new CropGrowthComponent());
});