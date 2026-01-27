import { world, system, Player, ItemStack, EnchantmentType, } from "@minecraft/server";
import { log, Util } from "./lib/Util";

export class Item {
    static get() {
        const itemStack = new ItemStack(`minecraft:fishing_rod`);
        itemStack.lockMode = `inventory`;

        const enchantComp = itemStack.getComponent(`enchantable`);
        enchantComp.addEnchantment({ type:new EnchantmentType("lure"), level:2 });

        return itemStack;
    };

    /**
     * 釣り竿を付与
     * 付与成功:true 付与失敗:false
     * @param {Player} player 
     */
    static add(player) {
        const res = player.getComponent(`inventory`).container.addItem(Item.get());

        if(res)return false;
        else return true;
    };

    /**
     * 釣り竿を回収
     * @param {Player} player 
     */
    static clearFishingRod(player) {
        const container = player.getComponent(`inventory`).container;
        for(let i=0; i<container.size; i++) {
            const itemStack = container.getItem(i);
            if(itemStack?.typeId != `minecraft:fishing_rod`)continue;

            container.setItem(i);
        }
    }

    /**
     * 釣り竿を回収
     * @param {Player} player 
     * @param {number} interval 
     */
    static clearFish(player, interval) {
        const container = player.getComponent(`inventory`).container;
        const systemNum = system.runInterval(() => {
            if(interval <= 0)return system.clearRun(systemNum);

            for(let i=0; i<container.size; i++) {
                const itemStack = container.getItem(i);
                if(!itemStack)continue;

                const isFgItem = itemStack.getLore().find(txt => txt == `fg_item`);
                if(isFgItem) {
                    container.setItem(i);
                    return system.clearRun(systemNum);
                }
            };

            interval -= 20;
        }, 20);
    }

}