import { system, BlockCustomComponent } from "@minecraft/server";

export class BlockEffectComponent implements BlockCustomComponent {

    onPlayerInteract(event, params) { 
        const { player} = event;
        const { effect, tickDuration, amplifier, tickDelay } = params.params;
        
        system.runTimeout(() => {
            player.addEffect(effect, tickDuration, { amplifier: amplifier, showParticles: true });
        }, tickDelay);  //apply effects after delay in ticks
    }
}
