import { system, BlockCustomComponent } from "@minecraft/server";

export class ItemEffectComponent implements BlockCustomComponent {

    onConsume(arg: ItemComponentConsumeEvent, params) { 
        const { effect, tickDuration, amplifier, tickDelay } = params.params;
        
        system.runTimeout(() => {
            arg.source.addEffect(effect, tickDuration, { amplifier: amplifier, showParticles: true });
        }, tickDelay);  //apply effects after delay in ticks
    }
}