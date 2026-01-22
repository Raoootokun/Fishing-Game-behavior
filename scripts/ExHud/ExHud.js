import { world, system, Player, } from "@minecraft/server";

const SPLIT_TXT = ":/1/:";

class ExHud {

 

    /**
     * @param {Player} player 
     * @param {string} actionbarText 
     * @param {string[]} sidebarTexts 
     */
    // static show(player, actionbarText, sidebarTexts) {
    //     actionbarText = "Actionbar\nhealth: 20\nSpeed:0.2";
    //     sidebarTexts = [ "AAA:--:Player-1", "Player-2", "Player-3", "Player-4", "Player-4", "Player-4" ];
    //     const sidebarNumbers = [ "§r0", "§r0", "§r0", "§r^__^", "§r0", "§r0", ];

    //     const txt = actionbarText + ":/1/:" + sidebarTexts.join("\n§r") + ":/1/:" + sidebarNumbers.join("\n§r") + ":/1/:" + "情報";
        
    
    //     player.onScreenDisplay.setActionBar(txt);
    // }



    /**
     * 常時実行
     */
    static loop() {
        for(const player of world.getPlayers()) {
            //アクションバーのstayDurationチェック
            Actionbar.loop(player);

            const actionbarText = ExHud.getActionbarText(player);
            const sidebarText = ExHud.getSidebarText(player);
            if(!actionbarText && !sidebarText)continue;

            player.onScreenDisplay.setActionBar(actionbarText + SPLIT_TXT + sidebarText);
        };
    }

    /**
     * アクションバーに表示するテキストを取得
     */
    static getActionbarText(player) {
        const rawData = player.getDynamicProperty(`actionbar`);
        if(!rawData)return ``;

        const data = JSON.parse(rawData);
        return data;
    }

    /**
     * サイドバーに表示するテキストを取得
     */
    static getSidebarText(player) {
        const showObjectiveId = Sidebar.show(player);
        if(!showObjectiveId)return ``;

        //オブジェクトが存在しているか
        const objective = world.scoreboard.getObjective(showObjectiveId);
        if(!objective)return ``;

        //オブジェクト名を取得
        const objectiveName = objective.displayName;

        const rawData = player.getDynamicProperty(`sidebar.${showObjectiveId}`);
        if(!rawData)return ``;

        const list = JSON.parse(rawData);
        if(list.length == 0)return ``;

        let texts;
        let scores;

        for(const scoreInfo of list) {
            texts += scoreInfo.text;
            scores += scoreInfo.score;
        };

        return texts + SPLIT_TXT + scores + SPLIT_TXT + objectiveName;

    }
};



class Actionbar {

    /**
     * Set
     * @param {Player} player 
     * @param {string} text 
     * @param {number} stayDuration 
     */
    static set(player, text, stayDuration = 20*3) {
        const data = {
            text: text,
            stayTick: stayDuration,
            startTick: system.currentTick
        };
        const rawData = JSON.stringify(data);

        player.setDynamicProperty(`actionbar`, rawData);
    }

    static loop(player) {
        const rawData = player.getDynamicProperty(`actionbar`);
        if(!rawData)return;

        const data = JSON.parse(rawData);

        //経過時間の取得
        const tick = system.currentTick - data.startTick;
        //stayTickより多い場合は削除
        if(tick > data.stayTick) player.setDynamicProperty(`actionbar`);
    }
}



class Sidebar {

    /**
     * Set
     * @param {Player} player 
     * @param {string} objectiveId 
     * @param {string} text 
     * @param {number} score 
     */
    static set(player, objectiveId, text, score) {
        const objective = world.scoreboard.getObjective(objectiveId);
        if(!objective)return;

        //DPを取得
        const oldRawList = player.getDynamicProperty(`sidebar.${objectiveId}`) ?? `[]`;
        const list = JSON.parse(oldRawList);
        list.push({ text:text, score:score });

        //DPに保存
        const newRawList = JSON.stringify(list);
        player.setDynamicProperty(`sidebar.${objectiveId}`, newRawList);
    };

    /**
     * Remove 
     * @param {Player} player 
     * @param {string} objectiveId 
     * @param {string} text 
     */
    static remove(player, objectiveId, text) {
        const objective = world.scoreboard.getObjective(objectiveId);
        if(!objective)return;

        //DPを取得
        const oldRawList = player.getDynamicProperty(`sidebar.${objectiveId}`) ?? `[]`;
        const list = JSON.parse(oldRawList);

        //list内を検索 & 削除
        const index = list.map(d => d.text).indexOf(text);
        if(index = -1)return;
        list.splice(index, 1);

        //DPに保存
        const newRawList = JSON.stringify(list);
        player.setDynamicProperty(`sidebar.${objectiveId}`, newRawList);
    }

    /**
     * Remove All
     * @param {Player} player 
     * @param {string} objectiveId 
     */
    static removeAll(player, objectiveId) {
        const objective = world.scoreboard.getObjective(objectiveId);
        if(!objective)return;

        //削除
        player.setDynamicProperty(`sidebar.${objectiveId}`);
    };

    /**
     * Set Ref
     * @param {Player} player 
     * @param {string} objectiveId 
     * @param {string} baseText 
     */
    static setRef(player, objectiveId, baseText) {
        const objective = world.scoreboard.getObjective(objectiveId);
        if(!objective)return;

        const score = objective.getScore(baseText);
        if(score == undefined)return;

        //DPを取得
        const oldRawList = player.getDynamicProperty(`sidebar.${objectiveId}`) ?? `[]`;
        const list = JSON.parse(oldRawList);
        list.push({ text:baseText, score:score });

        //DPに保存
        const newRawList = JSON.stringify(list);
        player.setDynamicProperty(`sidebar.${objectiveId}`, newRawList);
    };

    /**
     * Show
     * @param {Player} player 
     * @param {string} objectiveId 
     */
    static show(player, objectiveId = undefined) {
        if(!objectiveId)return player.getDynamicProperty(`sidebarSHow`);

        player.setDynamicProperty(`sidebarSHow`, objectiveId);
    }

}



system.runInterval(() => {
    ExHud.loop();
});


