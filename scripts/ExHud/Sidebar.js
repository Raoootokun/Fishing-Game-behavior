import { world, system, Player, ItemStack, Block } from "@minecraft/server";

export class Sidebar {

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

        //追加済みかどうか
        const index = list.map(d => d.text).indexOf(text);
        if(index != -1)return;
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
        if(index == -1)return;
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