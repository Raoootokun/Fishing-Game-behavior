import { world, system, Player, } from "@minecraft/server";
import { ModalFormData, } from "@minecraft/server-ui";
import { log, Util } from "./lib/Util";
import { worldDB } from "./main";

export class Form {

    /**
     * 設定フォームを表示
     * @param {Player} player 
     */
    static showSetting(player) {
        const scores = worldDB.get(`scores`);
        const time = worldDB.get(`time`);

        const form = new ModalFormData();
        form.title(`釣り大会 設定`);
        //ポイント
        for(const fishId of Object.keys(scores)) {
            const currentValue = scores[fishId];

            form.textField(fishId, `ポイント`, { defaultValue:currentValue });
        };
        //時間
        form.slider(`時間`, `(s)`, );
        form.show(player).then(res => {
            if(res.canceled)return;

        });
    }
}