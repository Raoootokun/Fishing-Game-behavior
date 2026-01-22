import { world, system, Player, ItemStack, Block } from "@minecraft/server";
import { log } from "../lib/Util";
import { Actionbar } from "./Actionbar";
import { Sidebar } from "./Sidebar";
import "./command";

const SPLIT_TXT = ":/1/:";

export class ExHud {
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
        if(!rawData)return `§r`;

        const data = JSON.parse(rawData);
        const text = data.text;

        return text;
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

    
        let texts = ``;
        let scores = ``;

        for(const scoreInfo of list) {
            texts += `\n${scoreInfo.text}`;
            scores += `\n§r${scoreInfo.score}`;
        };

        return texts + SPLIT_TXT + scores + SPLIT_TXT + objectiveName;

    }
};

system.runInterval(() => {
    ExHud.loop();
});