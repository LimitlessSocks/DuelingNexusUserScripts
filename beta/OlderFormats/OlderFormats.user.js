// ==UserScript==
// @name         Dueling Nexus Older Formats Banlist Addition
// @namespace    https://duelingnexus.com/
// @version      0.1
// @description  Allows one to view Edison Format etc.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/editor/*
// @require      BanlistInit.js
// @require      Edison.js
// @updateURL    https://github.com/LimitlessSocks/DuelingNexusUserScripts/raw/master/beta/OlderFormats/OlderFormats.user.js
// @downloadURL  https://github.com/LimitlessSocks/DuelingNexusUserScripts/raw/master/beta/OlderFormats/OlderFormats.user.js
// ==/UserScript==

class HistoricalBanlist {
    constructor(name, ids) {
        this.name = name;
        this.banlistIds = ids;
        this.banUnlistedCards();
        // this.oldLimitStatus = null;
        // this.breakdown = new TrinityBreakdown(this);
        this.hash = null;
        // this.icons = TrinityBanlistExtension.icons;
    }
    
    banUnlistedCards() {
        for(let key of Object.keys(Engine.database.cards)) {
            if(typeof this.banlistIds[key] === "undefined") {
                this.banlistIds[key] = 0;
            }
        }
    }
}

EXT.EDIT_API.waitForReady().then(() => {
    for(let banlistInfo of BANLISTS) {
        let banlist = new TrinityBanlist(banlistInfo.name, banlistInfo.ids);
        TrinityBanlistExtension.formats.push(banlist);
        EXT.EDIT_API.registerBanlist(banlist);
    }
}