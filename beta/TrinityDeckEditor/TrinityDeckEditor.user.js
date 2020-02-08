// ==UserScript==
// @name         Dueling Nexus Trinity Deck Editor
// @namespace    https://duelingnexus.com/
// @version      0.2
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
    
    load: function () {
        EXT.RECALCULATE_BANLIST = true;
    },
    unload: function () {
        EXT.RECALCULATE_BANLIST = false;
    },
    
    isRestricted: function (limitStatus) {
        return limitStatus !== -1;
    },
    
    statusMeanings: {
        [-1]: "normal",
        0: "forbidden",
        1: "semiforbidden",
        2: "coforbidden",
        3: "unbound",
        4: "trinity",
    },
    
    simpleRestrictedStatus: function (cardId) {
        let status = TrinityBanlistJSON.banlistIds[cardId];
        status = status === undefined ? -1 : status;
        return status;
    },
    
    // TODO: potential model of get initial card counts then keep track with onEdit functions
    sortRestricted: function (state = EXT.EDIT_API.currentDeckState()) {
        let statistics = {
            normal: [],
            coforbidden: [],
            semiforbidden: [],
            forbidden: [],
            unbound: [],
            trinity: [],
        };
        let statuses = {};
        let allCards = [].concat(state.main, state.extra, state.side);
        for(let cardId of allCards) {
            // calculate trinities
            let status = TrinityBanlistJSON.simpleRestrictedStatus(cardId);
            
            if(status === -1 && statistics.normal.indexOf(cardId) !== -1) {
                status = 4;
            }
            
            let category = TrinityBanlistJSON.statusMeanings[status];
            
            statistics[category].push(cardId);
            statuses[cardId] = statuses[cardId] || [];
            statuses[cardId].push(status);
        }
        return {
            categories: statistics,
            statuses: statuses,
        }
    },
    
    // -1 - normal
    // 0 - forbidden
    // 1 - semi-forbidden
    // 2 - co-forbidden
    // 3 - unbound
    // 4 - trinity
    allowedCount: function (id, index = null) {
        if(index === null) {
            return TrinityBanlistJSON.simpleRestrictedStatus(id);
        }
        let info = TrinityBanlistJSON.sortRestricted();
        return info.statuses[id][index];
    },
    
    icons: {
        0: "https://static.wixstatic.com/media/e92756_0e3b03868d904854a401737004d3a6c0~mv2.png/v1/crop/x_0,y_19,w_1000,h_997/fill/w_63,h_63,al_c,q_85,usm_0.66_1.00_0.01/fo.webp",
        1: "https://static.wixstatic.com/media/e92756_723989963d41466aaa4140e67a28167b~mv2.png/v1/fill/w_63,h_63,al_c,q_85,usm_0.66_1.00_0.01/Co.webp",
        2: "https://static.wixstatic.com/media/e92756_84a95aca5554478193ec85637c732605~mv2.png/v1/crop/x_2,y_2,w_998,h_983/fill/w_64,h_63,al_c,q_85,usm_0.66_1.00_0.01/Semi.webp",
        3: "https://i.imgur.com/XexL4Ra.png",
        4: "https://i.imgur.com/lNHKGqb.png",
        // 3: "https://i.imgur.com/nwLcKmU.png",
        // 3: "https://static.wixstatic.com/media/e92756_e4a4a871625142b2aa104650f96380ad~mv2.png/v1/fill/w_63,h_63,al_c,q_85,usm_0.66_1.00_0.01/yellow.webp",
    },
};

EXT.EDIT_API.waitForReady().then(() => {
    EXT.EDIT_API.registerBanlist(TrinityBanlistJSON);
});