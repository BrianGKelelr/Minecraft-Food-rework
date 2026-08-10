import { world } from "@minecraft/server";

world.afterEvents.worldLoad.subscribe(() => {
    import("./food.ts");
    import("./brownie.ts");
});