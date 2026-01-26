import { world, system, Player, } from "@minecraft/server";
import { log, Util } from "./lib/Util";
import playerFishingAfterEvent from "./playerFishingAfterEvent";
import { GameSystem } from "./GameSystem";

playerFishingAfterEvent.subscribe(ev => {
    const { player, itemStack, itemEntity, result } = ev;

    log(itemEntity);
    log(result);
});


system.afterEvents.scriptEventReceive.subscribe(ev => {
    const { id, message, sourceType, sourceEntity, sourceBlock } = ev;

    if(id == `fg:init`) GameSystem.init();
    if(id == `fg:join`) GameSystem.join();
});