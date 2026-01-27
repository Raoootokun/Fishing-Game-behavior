import { world, system, Player, ItemStack, } from "@minecraft/server";
import { log, Util } from "./lib/Util";
import { Score } from "./Score";
import { Item } from "./Item";
import { worldDB } from "./main";
import { ExHud } from "./ExHud";

export class GameSystem {
    /**
     * 一秒毎に実行
     * @param {Player} player 
     */
    static loop(player) { 
        if(player.time <= 0) {
            GameSystem.finish(player);
            return;
        }

        player.time--;
    }

    /**
     * objective の作成 & 初期化
     * スコア表を作成
     */
    static init() {
        GameSystem.players = {};

        try{
            world.scoreboard.removeObjective(`fg_point`);
        }catch(e){};

        worldDB.set(`scores`, {
            'minecraft:cod': 10,
            'minecraft:salmon': 15,
            'minecraft:tropical_fish': 25,
            'minecraft:pufferfish': 30,
        });
        worldDB.set(`time`, 500);
         
        world.scoreboard.addObjective(`fg_point`);
        world.sendMessage(`[釣り大会] オブジェクト/ポイントを初期化しました`);
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
        };

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
        delete player.time;
        
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

        //残り時間を設定
        player.time = worldDB.get(`time`);

        GameSystem.players[player.id] = player;
        GameSystem.setState(player, "fg_play");

        player.sendMessage(`§c釣り大会開始!!`);
    }

    /**
     * アイテムを釣ったときに実行
     * ポイント付与、アイテム削除
     * @param {Player} player 
     * @param {ItemStack} itemStack  
     */
    static fishing(player, itemStack) {
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
     * ゲーム終了時に処理
     * stateを fg_join に変更
     * タイトル、ポイント表示
     * @param {Player} player 
     */
    static finish(player) {
        Item.clearFishingRod(player);
        GameSystem.setState(player, "fg_join");
        delete player.time;

        const score = Score.get(player);

        player.onScreenDisplay.setTitle(`釣り大会`, {
            fadeInDuration:0, stayDuration:60, fadeOutDuration:20,
            subtitle: `終了`
        });
        player.sendMessage(`- 得点: §b${score} 点§f -`);
    }



    /**
     * プレイヤーの状態を取得   
     * fg_join, fg_play, undefined
     * @param {Player} player 
     * @returns {string | undefined}
     */
    static getState(player) {
        return player.state;
    };

    /**
     * プレイヤーの状態を設定
     * fg_join, fg_play, undefined
     * @param {Player} player 
     * @param {string | undefined} state 
     */
    static setState(player, state) {
        for(const tag of player.getTags().filter(tag => tag.startsWith(`fg_`))) {
            player.removeTag(tag);
        };

        if(state) {
            player.state = state;
            player.addTag(state);
        }else {
            delete player.state;
        }
    };

    /**
     * 状態が fg_play のプレイヤーを取得します
     */
    static getPlayers() {
        return world.getPlayers().filter(player => GameSystem.getState(player) == `fg_play` );
    }
}


