import { system, ItemComponentConsumeEvent, ItemCustomComponent } from "@minecraft/server";

interface EffectConfig {
    effect: string;
    tickDuration: number;
    amplifier: number;
    tickDelay: number;
}

export class ItemEffectComponent implements ItemCustomComponent {

    onConsume(arg: ItemComponentConsumeEvent, params) {
    const raw = params.params;
    const effects: EffectConfig[] = Array.isArray(raw) ? raw : [raw];

    for (const { effect, tickDuration, amplifier, tickDelay } of effects) {
        system.runTimeout(() => {

            if (!arg.source){
                return;
            }
            
            arg.source.addEffect(effect, tickDuration, { amplifier: amplifier, showParticles: true });
        }, tickDelay);
    }
}
}