
import { world, system, Player, } from "@minecraft/server";
import { WorldLoad } from "./lib/WorldLoad" 
import "./ExHud/ExHud";

world.sendMessage("reload!");

WorldLoad.subscribe(() => {
    
})