import { world, system, Player, } from "@minecraft/server";

export class SplitHud {

    static get splitLength() {
        return 200;
    };

    /**
     * @param {Player} player 
     * @param {string} actionbarText 
     * @param {string[]} sidebarTexts 
     */
    static show(player, actionbarText, sidebarTexts) {
        actionbarText = "Actionbar\nhealth: 20\nSpeed:0.2";
        sidebarTexts = [ "AAA:--:Player-1", "Player-2", "Player-3", "Player-4", "Player-4", "Player-4" ];
        const sidebarNumbers = [ "§r0", "§r0", "§r0", "§r^__^", "§r0", "§r0", ];

        const txt = actionbarText + ":/1/:" + sidebarTexts.join("\n§r") + ":/1/:" + sidebarNumbers.join("\n§r") + ":/1/:" + "情報";
        
    
        player.onScreenDisplay.setActionBar(txt);
    }

};

//文字列のバイト数を取得
function getByte(string) {
    var l = 0;
    for(var i=0; i<string.length; i++) {
        var c = string.charCodeAt(i);
        if(string[i] == `§` || (c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            l += 1;
            if(string[i-1] == `§`)l += 1;
        }else {
            l += 3;
        };
    };
    return l;
};

/**

Class.show(player, "ActionBar", [ "Test1", "test2", "test3" ]);



 */