import { world, system, Player, } from "@minecraft/server";
import { WorldLoad } from "./lib/WorldLoad"
import { ExHud } from "./ExHud";

import "./events";
import { GameSystem } from "./GameSystem";

const VERSION = [ 0, 1, 0 ];
WorldLoad.subscribe(ev => {
    ev.reloadLog("§b釣り大会", VERSION);

    system.runInterval(() => {

        for(const player of world.getPlayers()) {
            const state = GameSystem.getState(player);

            

            ExHud.actionbar(player, `state:${state}`);
        };
    })
});


