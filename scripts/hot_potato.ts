import { system, world, EntityComponentTypes, EntityInventoryComponent, EntityDamageCause, Entity } from "@minecraft/server";

// tracks players who are already on their 10-second fuse, so shuffling
// the potato between slots doesn't restart the timer or fire twice
const armedPlayers = new Set<string>();

world.afterEvents.playerInventoryItemChange.subscribe((event) => {
    const { player, itemStack, beforeItemStack } = event;

    if (itemStack?.typeId !== "relleks_food:hot_potato") {
        return;
    }

    // slot already held a hot potato before this change
    if (beforeItemStack?.typeId === "relleks_food:hot_potato") {
        return;
    }

    if (armedPlayers.has(player.id)) {
        return; // already ticking down from an earlier pickup
    }
    armedPlayers.add(player.id);

    player.setOnFire(10, true);

    system.runTimeout(() => {
        armedPlayers.delete(player.id);
        if (!player) return;

        const inventory = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
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

function explode(target: Entity): void {
    if (!target){
        return;
    }

    target.dimension.createExplosion(target.location, 2, {
        breaksBlocks: false,
        causesFire: false,
        allowUnderwater: true,
        source: target,
    });

    target.applyDamage(255, {cause: EntityDamageCause.entityExplosion,});
}