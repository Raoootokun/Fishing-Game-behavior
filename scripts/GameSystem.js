import { world, system, Player, ItemStack, } from "@minecraft/server";
import { log, Util } from "./lib/Util";
import { Score } from "./Score";
import { Item } from "./Item";
import { worldDB } from "./main";

export class GameSystem {
    /**
     * objective の作成 & 初期化
     * スコア表を作成
     */
    static init() {
        try{
            world.scoreboard.removeObjective(`fg_point`);
        }catch(e){};

        worldDB.set(`scoreDatas`, {
            'minecraft:cod': 10,
            'minecraft:salmon': 15,
            'minecraft:tropical_fish': 25,
            'minecraft:pufferfish': 30,
        });
         
        world.scoreboard.addObjective(`fg_point`);
        world.sendMessage(`[釣り大会] 初期化しました`);
    };

    /**
     * fg_join付与、得点初期化、案内表示
     * @param {Player} player 
     */
    static join(player) {
        const nowState = GameSystem.getState(player);
        if(nowState == `fg_play`) {
            player.sendMessage(`§4現在、ゲームをプレイ中です。`);
            player.playSound(`note.bass`);
            return;
        }

        GameSystem.setState(player, "fg_join");
        Score.init(player);

        player.sendMessage(`釣り大会に参加しました。\n開始ボタンを押したらゲームが開始されます。`);
    }

    /**
     * fg_join,fg_playを削除
     * @param {Player} player 
     */
    static exit(player) {
        GameSystem.setState(player, undefined);
        Item.clearFishingRod(player);

        player.sendMessage(`釣りゲームを退出しました。\n再びゲームを開始するまでスコアはリセットされません。`);
        player.playSound(`random.orb`);
    }

    /**
     * fg_play付与, 釣り竿付与
     * @param {Player} player 
     */
    static play(player) {
        const nowState = GameSystem.getState(player);
        if(nowState == `fg_play`) {
            player.sendMessage(`§4現在、ゲームをプレイ中です。`);
            player.playSound(`note.bass`);
            return;
        };
        if(nowState == undefined) {
            player.sendMessage(`§4参加ボタンを先に押してください。`);
            player.playSound(`note.bass`);
            return;
        }

        //釣り竿を付与
        const res = Item.add(player);
        //付与を失敗した場合は中断
        if(!res) {
            player.sendMessage(`§4インベントリに空きスロットがないため、ゲームを開始できません。\nもう一度開始ボタンを教えてください。`);
            return;
        }

        GameSystem.setState(player, "fg_play");

        player.sendMessage(`§c釣り大会開始!!`);
    }

    static fishing(player, itemStack, itemEntity) {
        const nowState = GameSystem.getState(player);
        if(nowState != `fg_play`)return;

        const fishId = itemStack.typeId;
        //連れたアイテムを削除
        Item.clearFish(player, 20*3);

        //スコアを追加
        const score = Score.add(player, fishId);
        if(!score)return;
        
        for(const other of GameSystem.getPlayers()) {
            other.sendMessage(`${player.name}は§b${itemStack.nameTag}§fを釣り上げた。(+${score})`);
        }
    }




    /**
     * プレイヤーの状態を取得   
     * fg_join, fg_play, undefined
     * @param {Player} player 
     * @returns {boolean | undefined}
     */
    static getState(player) {
        return player.getTags().find(tag => tag.startsWith(`fg_`));
    };

    /**
     * プレイヤーの状態を設定
     * fg_join, fg_play, undefined
     * @param {Player} player 
     * @param {string} state 
     */
    static setState(player, state) {
        for(const tag of player.getTags().filter(tag => tag.startsWith(`fg_`))) {
            player.removeTag(tag);
        };

        if(state)player.addTag(state);
    };

    /**
     * 状態が fg_join, fg_play のプレイヤーを取得します
     */
    static getPlayers() {
        return world.getPlayers().filter(player => GameSystem.getState(player));
    }
}


