import { world, system, Player, ItemStack, Block } from "@minecraft/server";

export class Actionbar {

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