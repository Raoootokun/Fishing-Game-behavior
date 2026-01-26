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

    /**
     * fg_join付与、得点初期化、案内表示
     * @param {Player} player 
     */
    static join(player) {

        GameSystem.setState(player, "fg_join");

        player.sendMessage(``)
    }

    /**
     * fg_join,fg_playを削除
     * @param {Player} player 
     */
    static exit(player) {
        GameSystem.setState(player, undefined);

        player.sendMessage(`釣りゲームを退出しました。\n再びゲームを開始するまでスコアはリセットされません。`);
        player.playSound(`random.orb`);
    }






    /**
     * プレイヤーの状態を取得   
     * fg_join, fg_play, undefined
     * @param {Player} player 
     * @returns {boolean | undefined}
     */
    static getState(player) {
        //fg_join, fg_play
        return player.getTags().find(tag => { tag.startsWith(`fg_`) })
    };

    /**
     * プレイヤーの状態を設定
     * fg_join, fg_play, undefined
     * @param {Player} player 
     * @param {string} state 
     */
    static setState(player, state) {
        for(const tag of player.getTags().filter(tag => { tag.startsWith(`fg_`) })) {
            player.removeTag(tag);
        };

        if(state)player.addTag(state);
    }
}


