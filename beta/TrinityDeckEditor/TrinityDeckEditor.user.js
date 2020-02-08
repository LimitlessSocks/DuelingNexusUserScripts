// ==UserScript==
// @name         Dueling Nexus Trinity Deck Editor
// @namespace    https://duelingnexus.com/
// @version      0.1.1
// @description  Revamps the deck editor search feature.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/editor/*
// @require      Banlist.js
// @updateURL    https://github.com/LimitlessSocks/DuelingNexusUserScripts/raw/master/beta/TrinityDeckEditor/TrinityDeckEditor.user.js
// @downloadURL  https://github.com/LimitlessSocks/DuelingNexusUserScripts/raw/master/beta/TrinityDeckEditor/TrinityDeckEditor.user.js
// ==/UserScript==

const TrinityBanlistJSON = {
    name: "2020.01 TRIN",
    banlistIds: TrinityBanlist, // defined in Banlist.js
    hash: null, // dummy value, not used for deck editor
    allowedCount: null,
    
    load: function () {
        // EXT.BYPASS_LIMIT = false;
    },
    unload: function () {
        // EXT.BYPASS_LIMIT = true;
    },
    
    isRestricted: function (limitStatus) {
        return limitStatus !== -1;
    },
    
    icons: {
        0: "https://static.wixstatic.com/media/e92756_0e3b03868d904854a401737004d3a6c0~mv2.png/v1/crop/x_0,y_19,w_1000,h_997/fill/w_63,h_63,al_c,q_85,usm_0.66_1.00_0.01/fo.webp",
        1: "https://static.wixstatic.com/media/e92756_723989963d41466aaa4140e67a28167b~mv2.png/v1/fill/w_63,h_63,al_c,q_85,usm_0.66_1.00_0.01/Co.webp",
        2: "https://static.wixstatic.com/media/e92756_84a95aca5554478193ec85637c732605~mv2.png/v1/crop/x_2,y_2,w_998,h_983/fill/w_64,h_63,al_c,q_85,usm_0.66_1.00_0.01/Semi.webp",
        3: "https://i.imgur.com/nwLcKmU.png",
        // 3: "https://static.wixstatic.com/media/e92756_e4a4a871625142b2aa104650f96380ad~mv2.png/v1/fill/w_63,h_63,al_c,q_85,usm_0.66_1.00_0.01/yellow.webp",
    },
};

// 0 - forbidden
// 1 - semi-forbidden
// 2 - co-forbidden
// 3 - unbound
// -1 - normal
TrinityBanlistJSON.allowedCount = function (index) {
    let count = TrinityBanlistJSON.banlistIds[index];
    // TODO: take into account the deck size
    return count === undefined ? -1 : count;
};

EXT.EDIT_API.waitForReady().then(() => {
    console.log("cool");
    EXT.EDIT_API.registerBanlist(TrinityBanlistJSON);
});