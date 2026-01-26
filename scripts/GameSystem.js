import { world, system, Player, } from "@minecraft/server";
import { log, Util } from "./lib/Util";

export class GameSystem {
    static objective;
    
    /**
     * objective の作成 & 初期化
     */
    static init() {
        try{
            world.scoreboard.removeObjective(`fg_point`);
        }catch(e){};
         
        GameSystem.objective = world.scoreboard.addObjective(`fg_point`);
        world.sendMessage(`[釣り大会] 初期化しました`)
    };






    static playerGetState(player) {
        const 
    }
}


