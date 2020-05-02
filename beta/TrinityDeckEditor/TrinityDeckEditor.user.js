// ==UserScript==
// @name         Dueling Nexus Trinity Deck Editor
// @namespace    https://duelingnexus.com/
// @version      0.4.1
// @description  Revamps the deck editor search feature.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/editor/*
// @require      BanlistInit.js
// @require      Banlist2020-1.js
// @updateURL    https://github.com/LimitlessSocks/DuelingNexusUserScripts/raw/master/beta/TrinityDeckEditor/TrinityDeckEditor.user.js
// @downloadURL  https://github.com/LimitlessSocks/DuelingNexusUserScripts/raw/master/beta/TrinityDeckEditor/TrinityDeckEditor.user.js
// ==/UserScript==

class TrinityBreakdown {
    constructor(format) {
        this.format = format;
    }
    
    composition(state) {
        let stats = this.format.deckStats(state);
        
        return [
            `Unrestricted: ${stats.normal}`,
            `Unbound: ${stats.unbound}`,
            `Trinities: ${stats.trinity}`,
            `Half Points: ${stats.coforbidden}`,
            `One Points: ${stats.semiforbidden}`,
            `Banned: ${stats.forbidden}`,
            `Total Points: ${stats.points}`,
            `Smallest Main Deck: ${stats.minSize}`,
        ];
    }
}

const TrinityBanlistExtension = {
    statusMeanings: {
        [-1]: "normal",
        0: "forbidden",
        1: "coforbidden",
        2: "semiforbidden",
        3: "unbound",
        4: "trinity",
    },
    icons: {
        0: "https://cdn.discordapp.com/attachments/486534021992677378/676477606270468146/Forbidden.png",
        2: "https://cdn.discordapp.com/attachments/405527007384829962/676594683991949332/P-symbol.png",
        1: "https://cdn.discordapp.com/attachments/405527007384829962/676594703956836412/P-2-symbol.png",
        3: "https://cdn.discordapp.com/attachments/486534021992677378/676480226376548363/Unbound.png",
        4: "https://cdn.discordapp.com/attachments/486534021992677378/676480217564577812/Trinity_Format.png",
    },
    
    oldIcons: {
        0: "https://static.wixstatic.com/media/e92756_0e3b03868d904854a401737004d3a6c0~mv2.png/v1/crop/x_0,y_19,w_1000,h_997/fill/w_63,h_63,al_c,q_85,usm_0.66_1.00_0.01/fo.webp",
        1: "https://static.wixstatic.com/media/e92756_723989963d41466aaa4140e67a28167b~mv2.png/v1/fill/w_63,h_63,al_c,q_85,usm_0.66_1.00_0.01/Co.webp",
        2: "https://static.wixstatic.com/media/e92756_84a95aca5554478193ec85637c732605~mv2.png/v1/crop/x_2,y_2,w_998,h_983/fill/w_64,h_63,al_c,q_85,usm_0.66_1.00_0.01/Semi.webp",
        3: "https://i.imgur.com/XexL4Ra.png",
        4: "https://i.imgur.com/lNHKGqb.png",
    },
    formats: []
};

class TrinityBanlist {
    constructor(name, ids) {
        this.name = name;
        this.banlistIds = ids;
        this.oldLimitStatus = null;
        this.breakdown = new TrinityBreakdown(this);
        this.hash = null;
        this.icons = TrinityBanlistExtension.icons;
    }
    
    load () {
        EXT.RECALCULATE_BANLIST = true;
        this.oldLimitStatus = EXT.STATISTICS_API.Breakdown.LimitStatus;
        EXT.STATISTICS_API.Breakdown.LimitStatus = this.breakdown;
    }
    
    unload () {
        EXT.RECALCULATE_BANLIST = false;
        EXT.STATISTICS_API.Breakdown.LimitStatus = oldLimitStatus;
    }
    
    isRestricted (limitStatus) {
        return limitStatus !== -1;
    }
    
    simpleRestrictedStatus (cardId) {
        let status = this.banlistIds[cardId];
        status = status === undefined ? -1 : status;
        return status;
    }
    // TODO: potential model of get initial card counts then keep track with onEdit functions
    sortRestricted (state = EXT.EDIT_API.currentDeckState(true)) {
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
            let status = this.simpleRestrictedStatus(cardId);
            
            // duplicate normals become trinities
            if(status === -1 && statistics.normal.indexOf(cardId) !== -1) {
                status = 4;
            }
            
            let category = TrinityBanlistExtension.statusMeanings[status];
            
            statistics[category].push(cardId);
            statuses[cardId] = statuses[cardId] || [];
            statuses[cardId].push(status);
        }
        return {
            categories: statistics,
            statuses: statuses,
        }
    }
    deckStats (state = EXT.EDIT_API.currentDeckState(true)) {
        let sorted = this.sortRestricted(state);
        let currentSize = 30;
        
        let info = {};
        
        info.coforbidden = sorted.categories.coforbidden.length;
        info.semiforbidden = sorted.categories.semiforbidden.length;
        info.unbound = sorted.categories.unbound.length;
        info.forbidden = sorted.categories.forbidden.length;
        info.trinity = sorted.categories.trinity.length;
        info.normal = sorted.categories.normal.length;
        
        let points = info.coforbidden / 2 + info.semiforbidden + info.trinity;
        info.points = points;
        points = Math.ceil(points);
        info.excess = 5 * points;
        info.minSize = currentSize + info.excess;
        
        let valid = state.main.length >= info.minSize;
        info.valid = valid && !info.forbidden;
        
        return info;
    }
        
    // -1 - normal
    // 0 - forbidden
    // 1 - co-forbidden
    // 2 - semi-forbidden
    // 3 - unbound
    // 4 - trinity
    allowedCount (id, index = null) {
        if(index === null) {
            return this.simpleRestrictedStatus(id);
        }
        let info = this.sortRestricted();
        return info.statuses[id][index];
    }
}

TrinityBanlistExtension.TrinityBanlist = TrinityBanlist;

window.TrinityBanlistExtension = TrinityBanlistExtension;

EXT.EDIT_API.waitForReady().then(() => {
// {        name: "2020.01 TRIN",
        // banlistIds: TrinityBanlistRaw, // defined in ./Banlist.js
    for(let banlistInfo of TRINITY_BANLISTS) {
        let banlist = new TrinityBanlist(banlistInfo.name, banlistInfo.ids);
        TrinityBanlistExtension.formats.push(banlist);
        EXT.EDIT_API.registerBanlist(banlist);
    }
});