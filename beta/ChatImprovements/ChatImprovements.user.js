// ==UserScript==
// @name         Dueling Nexus Chat Improvements Plugin
// @namespace    https://duelingnexus.com/
// @version      0.8.1
// @description  Revamps the chat and visual features of dueling.
// @author       Sock#3222
// @grant        none
// @match        https://duelingnexus.com/game/*
// @updateURL    https://raw.githubusercontent.com/LimitlessSocks/DuelingNexusUserScripts/master/beta/ChatImprovements/ChatImprovements.user.js
// @downloadURL  https://raw.githubusercontent.com/LimitlessSocks/DuelingNexusUserScripts/master/beta/ChatImprovements/ChatImprovements.user.js
// ==/UserScript==

// TODO: show chat during ranked
// TODO: show options during pre-round

let makeReadOnly = function (obj, prop) {
    let val = obj[prop];
    delete obj[prop];
    Object.defineProperty(obj, prop, {
        value: val,
        writable: false,
        enumerable: true,
        configurable: true,
    });
    return val;
}

let ChatImprovements = {
    log: [],
    storage: {
        _cache: null,
        get: null,
        set: null,
    },
};

const LOCAL_STORAGE_KEY = "ChatImprovementsCache";

let updateLocalStorage = function () {
    let json = JSON.stringify(ChatImprovements.storage._cache);
    localStorage.setItem("ChatImprovementsCache", json);
};

let checkCache = function () {
    if(ChatImprovements.storage._cache) {
        return;
    }
    
    let localCopy;
    try {
        localCopy = localStorage.getItem(LOCAL_STORAGE_KEY);
        localCopy = JSON.parse(localCopy)
    }
    catch(e) {
        console.error("Error parsing local copy:", localCopy);
    }
    
    ChatImprovements.storage._cache = localCopy || {};
    
    updateLocalStorage();
};

ChatImprovements.storage.set = function (item, value) {
    checkCache();
    
    ChatImprovements.storage._cache[item] = value;
    
    updateLocalStorage();
    
    return value;
};

const onObjectUpdate = (initial, fn, parents = []) => {
    let copy = new Proxy(initial, {
        get: function (obj, prop) {
            let val = obj[prop];
            if(typeof val === "object") {
                return onObjectUpdate(val, fn, [...parents, prop]);
            }
            return val;
        },
        set: function (obj, prop, val) {
            obj[prop] = val;
            fn(obj, parents, val);
            return copy[val];
        }
    });
    return copy;
};

ChatImprovements.storage.get = function (item) {
    checkCache();
    
    let entry = ChatImprovements.storage._cache[item];
    
    if(typeof entry === "object") {
        return onObjectUpdate(entry, function () {
            console.log("UPDATE!", item, entry);
            ChatImprovements.storage.set(item, entry);
        });
    }
    return entry;
};

ChatImprovements.storage.removeKey = function (key) {
    checkCache();
    
    delete ChatImprovements.storage._cache[key];
    
    updateLocalStorage();
};

ChatImprovements.storage.clear = function (item) {
    checkCache();
    
    ChatImprovements.storage._cache = {};
    
    updateLocalStorage();
};

// standard getter/setter properties

let defaultProperties = {
    playSounds: true,
    temporaryChat: true,
    showOptions: false,
    cardMargin: 0.3,
    
    showNormalEvents: true,
    showChainEvents: true,
    showTargetEvents: true,
    
    showOnHover: true,
    
    keybinds: {
        showYourGY: {
            key: "1",
        },
        showYourBanished: {
            key: "2",
        },
        showYourExtra: {
            key: "3",
        },
        showOpponentGY: {
            key: "4",
        },
        showOpponentBanished: {
            key: "5",
        },
        showOpponentExtra: {
            key: "6",
        },
        showBackrow: {
            key: "7",
        },
        showHand: {
            key: "8",
        },
        invokeSequence: {
            key: "j",
        },
        cancelSelection: {
            key: "Escape",
        },
    }
};

// maintains the key order of copyFrom
const deepMergeObjects = (source, copyFrom) => {
    let result = {};
    for(let [key, value] of Object.entries(copyFrom)) {
        let copyVal = copyFrom[key];
        if(key in source) {
            let sourceVal = source[key];
            if(typeof sourceVal === "object" && typeof copyVal === "object") {
                result[key] = deepMergeObjects(sourceVal, copyVal);
            }
            else {
                result[key] = sourceVal;
            }
        }
        else {
            result[key] = copyVal;
        }
    }
    
    return result;
};

for(let [prop, defaultValue] of Object.entries(defaultProperties)) {
    // define if unset (inital run)
    if(typeof ChatImprovements.storage.get(prop) === "undefined") {
        ChatImprovements.storage.set(prop, defaultValue);
    }
    else if(typeof defaultValue === "object") {
        let cur = ChatImprovements.storage.get(prop);
        ChatImprovements.storage.set(prop, deepMergeObjects(cur, defaultValue));
    }
    
    // getter & setter
    Object.defineProperty(ChatImprovements, prop, {
        get: function () {
            return ChatImprovements.storage.get(prop);
        },
        set: function (value) {
            return ChatImprovements.storage.set(prop, value);
        },
    });
}

makeReadOnly(ChatImprovements, "log");
window.ChatImprovements = ChatImprovements;

let waitFrame = function () {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
};

const waitForElementJQuery = async function (selector, source = $("body")) {
    let query;
    while (source.find(selector).length === 0) {
        await waitFrame();
    }
    return query;
};

let onload = function () {
    // css 
    $("head").append($(`<style>
    #ci-ext-misc {
        float: left;
        width: 25%;
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
    }
    #card-column {
        float: none;
        width: auto;
        border-bottom-width: 0px !important;
    }
    /* temporary fix */
    #card-column, #ci-ext-event-log, #ci-ext-log, #ci-ext-options {
        height: auto;
        max-height: 100% !important;
        min-height: auto !important;
    }
    
    #ci-ext-misc-sections > div {
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
    }
    #ci-ext-misc-sections > div:hover {
        z-index: 10;
    }
    
    #ci-ext-log > p, #ci-ext-event-log > p {
        padding: 0;
        margin: 3px;
    }
    
    #ci-ext-event-log .interact-name {
        cursor: pointer;
    }
    
    #ci-ext-log, #ci-ext-event-log, #ci-ext-options {
        background: rgb(0, 0, 0);
        background: rgba(0, 0, 0, 0.7);
    }
    @keyframes fullScale {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(2);
        }
    }
    .material-preview {
        margin: 3px;
    }
    
    #ci-ext-misc-buttons {
        display: flex;
        justify-content: space-between;
    }
    
    #ci-ext-misc-buttons > button {
        flex-grow: 1;
        flex-basis: 0;
    }
    
    /*#ci-ext-misc-sections > div {
        transition: height 0.1s;
    }*/
    
    #game-container {
        margin: 16px 16px 0px 16px;
    }
    
    .popup-card-preview:hover {
        transform: scale(1.4);
    }
    
    input[type=text] {
        height: 32px;
        background-color: rgba(0,0,0,.9);
        border: 1px solid #7a7a7a;
        color: #F0F0F0;
        padding-left: 8px;
    }
    
    #ci-ext-chat-cell {
        width: 70%;
    }
    #ci-ext-chat-buttons-cell {
        width: 25%;
    }
    
    #game-chat-content {
        overflow: auto;
        max-height: 11.4em;
    }
    #ci-ext-chat-container {
        width: 100%;
    }
    #ci-ext-chat-container td {
        padding: 0;
    }
    </style>`));
    
    // TODO: move chaining options on bottom right
    // TODO: add hide options for sleeves/avatars
    
    // window.mg = function mg(a, offset = ChatImprovements.cardMargin) {
        // a.a.data("sequence", a.D);
        // if (a.location & O.c || a.location & O.v || a.location & O.u || a.location & O.h) {
            // var b = 0 == a.controller ? 1 : -1;
            // b *= a.location & O.h ? -1 : 1;
            // a.a.css("left", b * a.D * offset + "%");
            // a.a.css("top", offset * -a.D + "%");
        // } else a.a.css("left", ""), a.a.css("top", "");
    // }
    
    // boilerplate
    const gameChatContent = $("#game-chat-content");
    const gameChatTextbox = $("#game-chat-textbox");
    const gameChatArea = $("#game-chat-area");
    const SECONDS = 1000;
    const LOCATIONS = {
        DECK: 1,
        HAND: 2,
        MONSTERS: 4,
        SPELL_TRAPS: 8,
        GY: 16,
        BANISHED: 32,
        EXTRA: 64,
    };
    const PLAYERS = {
        YOU: 0,
        OPPONENT: 1,
    }
    const revealLocation = function(player, location) {
        Game.cancelSelection();
        Game.closeActionMenu();
        // fc(m[player].f[location], true);
        Game.isAdvancedSelectionOpen = true;
    };
    
    const cardTypeMap = {};
    // expected result for Wf: { 0: "?", 1: "Monster", 2: "Spell", ... }
    for(let key in I18n.types) {
        let value = I18n.types[key];
        cardTypeMap[value] = parseInt(key, 10);
    }
    window.cardTypeMap = cardTypeMap;
    
    const isTrapCard            = (card) => card.type & cardTypeMap["Trap"];
    const isSpellCard           = (card) => card.type & cardTypeMap["Spell"];
    const isMonster             = (card) => !isTrapCard(card) && !isSpellCard(card);
    const isToken               = (card) => card.type & cardTypeMap["Token"];
    const isXyzMonster          = (card) => card.type & cardTypeMap["Xyz"];
    const isPendulumMonster     = (card) => card.type & cardTypeMap["Pendulum"];
    const isLinkMonster         = (card) => card.type & cardTypeMap["Link"];
    const isFusionMonster       = (card) => card.type & cardTypeMap["Fusion"];
    const isRitualMonster       = (card) => isMonster(card) && (card.type & cardTypeMap["Ritual"]);
    const isSynchroMonster      = (card) => card.type & cardTypeMap["Synchro"];
    const isNormalMonster       = (card) => card.type & cardTypeMap["Normal"];
    
    let chatLog = $("<div id=ci-ext-log>");
    let chatEventLog = $("<div id=ci-ext-event-log>");
    
    const CHAIN_SYMBOL = "\uD83D\uDD17";
    Game.messageHandlers.GameChaining = Game.onGameChaining = function onGameChaining(a) {
        Game.preloadImage(a.cardCode, function() {
            Game.playSound("activate");
            let cardName = a.cardCode ? "#@" + a.cardCode : "A card";
            let message = `Chain Link ${a.chainCount}: ${cardName}`
            if(a.chainCount > 1) {
                message = CHAIN_SYMBOL + " " + message;
            }
            notifyEvent(message, Events.CHAIN);
            Game.highlightCard(a.cardCode, Game.parseNextMessage);
        });
        return true;
    }
    
    const serializePlayerLocation = (player, location) =>
        `${player};${location}`;
    const popupLocation = (player, location) => {
        let serialized = serializePlayerLocation(player, location);
        // toggle off if already present
        if(popupLocation.currentLocation === serialized) {
            NexusGUI.closePopup();
            return;
        }
        // do not interrupt other popups
        if(!popupLocation.currentLocation && NexusGUI.isPopupOpen) {
            return;
        }
        // update serialized
        popupLocation.currentLocation = serialized;
        
        let container = Game.fields[player].zones[location];
        let content = $("<div>");
        for(let card of container) {
            if(!card) {
                continue;
            }
            let code = card.A || card.code;
            let img = $("<img>")
                .attr("src", Engine.getCardPicturePath(code))
                .attr("width", E + "px")
                .attr("class", "popup-card-preview")
                .hover(() => Engine.ui.setCardInfo(code));
            content.append(img);
        }
        if(content.children().length === 0) {
            content.append("(empty)");
        }
        let name = "";
        name += ["Your", "Opponent's"][player];
        name += " ";
        name += Bf[location] || "Unspecified Location";
        NexusGUI.popup(name, content, {
            style: "minimal-padded",
            ignoreForceClose: true
        }).then(() => {
            // console.log("NULLING!");
            popupLocation.currentLocation = null;
        });
    };
    popupLocation.currentLocation = null;
    ChatImprovements.popupLocation = popupLocation;
    
    ChatImprovements.KeyModifiers = {};
    $(window).keydown((ev) => {
        switch(ev.originalEvent.key) {
            case "Control":
                ChatImprovements.KeyModifiers.control = true;
                break;
            case "Shift":
                ChatImprovements.KeyModifiers.shift = true;
                break;
            case "Alt":
                ChatImprovements.KeyModifiers.alt = true;
                break;
        }
    });
    /* keybinds */
    $(window).keyup((ev) => {
        let target = $(ev.target);
        if(target.is("input, textarea")) {
            return;
        }
        switch(ev.originalEvent.key) {
            // key modifiers
            case "Control":
                ChatImprovements.KeyModifiers.control = false;
                break;
            case "Shift":
                ChatImprovements.KeyModifiers.shift = false;
                break;
            case "Alt":
                ChatImprovements.KeyModifiers.alt = false;
                break;
            // binds
            case ChatImprovements.keybinds.cancelSelection.key:
                Game.cancelSelection();
                break;
            case ChatImprovements.keybinds.showYourGY.key:
                popupLocation(PLAYERS.YOU, LOCATIONS.GY);
                break;
            case ChatImprovements.keybinds.showYourBanished.key:
                popupLocation(PLAYERS.YOU, LOCATIONS.BANISHED);
                break;
            case ChatImprovements.keybinds.showYourExtra.key:
                popupLocation(PLAYERS.YOU, LOCATIONS.EXTRA);
                break;
            case ChatImprovements.keybinds.showBackrow.key:
                popupLocation(PLAYERS.YOU, LOCATIONS.SPELL_TRAPS);
                break;
            case ChatImprovements.keybinds.showHand.key:
                popupLocation(PLAYERS.YOU, LOCATIONS.HAND);
                break;
            case ChatImprovements.keybinds.showOpponentGY.key:
                popupLocation(PLAYERS.OPPONENT, LOCATIONS.GY);
                break;
            case ChatImprovements.keybinds.showOpponentBanished.key:
                popupLocation(PLAYERS.OPPONENT, LOCATIONS.BANISHED);
                break;
            case ChatImprovements.keybinds.showOpponentExtra.key:
                popupLocation(PLAYERS.OPPONENT, LOCATIONS.EXTRA);
                break;
        }
    });
    
    const showOnHover = function (ev, delay = 1200) {
        if(!ChatImprovements.showOnHover) {
            return;
        }
        let el = $(this);
        if(el.data("hoverInterval")) {
            return;
        }
        
        let interval = setTimeout(() => {
            popupLocation(el.data("player"), el.data("location"));
        }, delay);
        el.data("hoverInterval", interval);
    };
    const cancelOnHover = function (ev) {
        let el = $(this);
        clearTimeout(el.data("hoverInterval"));
        el.data("hoverInterval", null);
    };
    const addHoverReveal = function (el) {
        el.mouseover(showOnHover);
        el.mouseout(cancelOnHover);
    };
    
    // let candidates = $("*[id^='game-field-player-'], *[id^='game-field-opponent-']"$("*[id^='game-field-player-'], *[id^='game-field-opponent-']");
    let candidates = [
        "#game-field-player-extra",
        "#game-field-player-deck",
        "#game-field-player-graveyard",
        "#game-field-player-banished",
        "#game-field-opponent-extra",
        "#game-field-opponent-deck",
        "#game-field-opponent-graveyard",
        "#game-field-opponent-banished",
    ];
    for(let candidate of candidates) {
        addHoverReveal($(candidate));
    }
    
    /*
        GameDamage: Yd,
        GameRecover: Zd,
        GamePayLpCost: $d,
        GameLpUpdate: ae,
        GameAttack: be,
        GameBattle: ce,
        GameReloadField: de,
        GameTagSwap: ee,
        GameFieldDisabled: fe,
        GameWaiting: ge,
        GameEquip: he,
        GameBecomeTarget: ie,
        GameWin: je,
        GameTossCoin: ke,
        GameTossDice: le,
        GameAddCounter: me,
        GameRemoveCounter: ne,
        GameConfirmCards: oe,
        GameConfirmDeckTop: pe,
        GameDeckTop: qe,
        GameRetry: re,
        GameSelectIdleCommand: se,
        GameSelectBattleCommand: te,
        GameSelectCard: ue,
        GameSelectUnselect: ve,
        GameSortCards: we,
        GameSelectTribute: xe,
        GameSelectYesNo: ye,
        GameSelectEffectYesNo: ze,
        GameSelectChain: Ae,
        GameSelectPosition: Be,
        GameSelectOption: Ce,
        GameSelectSum: De,
        GameSelectPlace: Ee,
        GameSelectCounter: Fe,
        GameAnnounceAttrib: Ge,
        GameAnnounceRace: He,
        GameAnnounceNumber: Ie,
        GameAnnounceCard: Je
    */
    
    let eventTypeList = [
        
    ];
    
    let timestamp = function () {
        let now = new Date();
        return [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
        ].map(time => time.toString().padStart(2, "0")).join(":");
    }
    
    const scrollToBottom = function (el) {
        el = $(el);
        el.animate({
            scrollTop: el.prop("scrollHeight")
        }, 150);
    }
    
    const MESSAGE_PARSE_REGEX = /#@(\d+)|.+?/g;
    let cardStyle = function (card) {
        if(isTrapCard(card)) {
            return {
                backgroundColor: "#BC5A84",
            };
        }
        else if(isSpellCard(card)) {
            return {
                backgroundColor: "#1D9E74",
            };
        }
        // must be monster
        else {
            let style = {
                background: "#B83D00",
            };
            
            if(isRitualMonster(card)) {
                style.background = "#3A70B1";
            }
            else if(isLinkMonster(card)) {
                style.background = "#0431CA";
            }
            
            if(isPendulumMonster(card)) {
                style.background = `linear-gradient(180deg, ${style.background} 0%, rgba(29,158,116,1) 100%)`;
            }
            
            return style;
        }
    }
    let displayMessage = function (content, color, ...kinds) {
        //Engine.ui.setCardInfo
        let matches;
        let message = $("<p>");
        while(matches = MESSAGE_PARSE_REGEX.exec(content)) {
            let id = parseInt(matches[1]);
            let card = Engine.getCardData(id);
            if(id && card) {
                let interactive = $("<span>")
                    .css("color", "white")
                    .css(cardStyle(card))
                    .data("id", id)
                    .addClass("interact-name");
                interactive.hover(function () {
                    Engine.ui.setCardInfo(id);
                });
                interactive.text('"' + card.name + '"');
                message.append(interactive);
            }
            else {
                message.append(matches[0]);
            }
        }
        for(let kind of kinds) {
            message.addClass(kind);
        }
        if(color) {
            message.css("color", color);
        }
        gameChatContent.append(message);
        let copy = message.clone(true);
        if(kinds.indexOf("notified-event") !== -1) {
            $(".interact-name", copy).unbind().click(function () {
                Engine.ui.setCardInfo($(this).data("id"));
                showCardColumn.click();
            });
            chatEventLog.append(copy);
        }
        else {
            chatLog.append(copy);
        }
        // scroll to message
        scrollToBottom(chatLog);
        scrollToBottom(gameChatContent);
        // updateColumnHeight();
        // handle UI
        if(ChatImprovements.temporaryChat) {
            if(gameChatContent.children().length > 10) {
                gameChatContent.find("p:first").remove();
            }
            setTimeout(function() {
                message.remove();
            }, 10 * SECONDS);
        }
        return message;
    }
    ChatImprovements.displayMessage = displayMessage;
    
    // overwrite send message
    window.td = displayMessage;
    
    let unifyMessage = function (message) {
        return timestamp() + " " + message;
    }
    
    let displayOpponentsMessage = function (a) {
        if(ChatImprovements.playSounds) {
            Game.playSound("chat-message");
        }
        let playerId = a.playerId;
        let message = a.message;
        let color;
        
        if(0 <= playerId && 3 >= playerId) {
            let name = B[playerId].name;
            message = "[" + name + "]: " + message;
        }
        else {
            color = "yellow";
        }
        
        message = unifyMessage(message);
        displayMessage(message, color);
    }
    
    const messageListener = function (ev) {
        let self = $(this);
        if(ev.keyCode == 13) {
            let message = self.val();
            self.val("");
            Game.sendMessage({
                type: "SendChatMessage",
                message: message
            });
            message = unifyMessage("[" + Game.username + "]: " + message);
            // TODO: assign each person a different color?
            if(4 > Game.position) {
                displayMessage(message);
            }
            else {
                displayMessage(message, "yellow");
            }
        }
    }
    gameChatTextbox.unbind();
    gameChatTextbox.keyup(messageListener);
    
    const roundTo = (n, places = 7) => 
        Math.round(n * 10 ** places) / (10 ** places);
    
    // create sections
    let miscContainer = $("<div id=ci-ext-misc>");
    let miscSections = $("<div id=ci-ext-misc-sections>");
    let optionsColumn = $("<div id=ci-ext-options>");
    let cardColumn = $("#card-column");
    let gameContainer = $("#game-container");
    gameContainer.prepend(miscContainer);
    
    // pseudo interface
    class OptionRenderable {
        constructor(name, id) {
            this.name = name;
            this.id = id;
        }
        
        get isRange() {
            return false;
        }
        
        get isCheckbox() {
            return false;
        }
        
        toElement() {
            return $("<div>")
                .text(this.name)
                .attr("id", this.id);
        }
    }
    
    class GameButton extends OptionRenderable {
        constructor(name, id, event) {
            super(name, id);
            this.event = event;
        }
        
        toElement() {
            return NexusGUI.button(this.name)
                .attr("id", this.id)
                .click(this.event);
        }
    }
    
    class GameOption extends OptionRenderable {
        constructor(name, id, option, type, info = {}) {
            super(name, id);
            this.id = id;
            this.option = option;
            this.type = type;
            
            this.isBaseOption = !!info.isBaseOption;
            this.showValue = !!info.showValue;
            this.decoration = info.decoration || (() => "");
            
            this.resolveOnLoad = info.resolveOnLoad;
            this.resolve = info.resolve;
            if(this.resolve) {
                this.resolve = this.resolve.bind(this);
            }
            
            if(this.isRange) {
                this.min = info.min;
                this.max = info.max;
            }
        }
        
        get isRange() {
            return this.type === "range";
        }
        
        get isCheckbox() {
            return this.type === "checkbox";
        }
        
        toElement(formatTable = true) {
            let base = $("<input>");
            
            base.attr("id", this.id)
                .attr("type", this.type);
            
            if(this.isRange) {
                base.attr("min", this.min)
                    .attr("max", this.max);
            }
            
            let currentValue;
            if(this.isBaseOption) {
                currentValue = Engine.storage.options[this.option];
            }
            else {
                currentValue = ChatImprovements[this.option];
            }
            
            if(this.isCheckbox) {
                base.prop("checked", currentValue);
            }
            else {
                base.val(currentValue);
            }
            
            base.data("option", this.option);
            
            let getValue = () => this.isCheckbox ? base.prop("checked") : base.val();
            
            let onValueChange = () => {
                let option = this.option;
                let value = getValue();
                
                if(this.isBaseOption) {
                    Engine.storage.options[option] = value;
                    Engine.storage.save();
                    
                    Game.updateOption && Game.updateOption(option, value);
                }
                else {
                    ChatImprovements[option] = value;
                }
                
                if(updateValueTd) {
                    updateValueTd.text(this.decoration(value));
                }
                if(this.resolve) {
                    this.resolve(value);
                }
            };
            
            let updateValueTd;
            if(this.showValue) {
                updateValueTd = $("<td>");
                // DRY broken here a bit
                updateValueTd.text(this.decoration(currentValue))
                             .css("cursor", "pointer");
                
                updateValueTd.click(() => {
                    NexusGUI.prompt("Enter the new value for \"" + this.tag + "\":").then((newValue) => {
                        if(newValue !== null) {
                            base.val(newValue);
                            onValueChange();
                        }
                    });
                });
            }
            
            base.change(onValueChange);
            
            if(!formatTable) {
                return base;
            }
            
            let tr = $("<tr>");
            
            tr.append($("<td>").text(this.name));
            tr.append($("<td>").append(base));
            
            if(this.showValue) {
                tr.append(updateValueTd);
            }
            
            if(this.resolveOnLoad) {
                this.resolve(getValue());
            }
            
            return tr;
        }
    };
    
    const displayKey = (data) => {
        let message = [];
        if(data.ctrl) {
            message.push("Ctrl");
        }
        if(data.shift) {
            message.push("Shift");
        }
        if(data.alt) {
            message.push("Alt");
        }
        if(data.key) {
            message.push(data.key);
        }
        return message.join(" + ");
    }
    // initialize options column
    let optionsColumnInfo = [
        [
            "Game Options",
            new GameOption(
                "Sounds volume",
                "ci-ext-option-sounds-volume",
                "sounds",
                "range",
                {
                    min: 0,
                    max: 100,
                    isBaseOption: true,
                    showValue: true,
                    decoration: (x) => `${x}%`,
                }
            ),
            new GameOption(
                "Music volume",
                "ci-ext-option-music-volume",
                "music",
                "range",
                {
                    min: 0,
                    max: 100,
                    isBaseOption: true,
                    showValue: true,
                    decoration: (x) => `${x}%`,
                }
            ),
            new GameOption(
                "Animations speed",
                "ci-ext-option-animation-speed",
                "speed",
                "range",
                {
                    min: 0,
                    max: 500,
                    isBaseOption: true,
                    showValue: true,
                    decoration: (x) => `${x}%`,
                }
            ),
        ],
        [
            new GameOption(
                "Place monsters automatically",
                "ci-ext-option-auto-place-monsters",
                "auto-place-monsters",
                "checkbox",
                {
                    isBaseOption: true,
                }
            ),
            new GameOption(
                "Place spells automatically",
                "ci-ext-option-auto-place-spells",
                "auto-place-spells",
                "checkbox",
                {
                    isBaseOption: true,
                }
            ),
            new GameOption(
                "Temporary chat",
                "ci-ext-option-temporary-chat",
                "temporaryChat",
                "checkbox",
                {
                    resolve: function () {
                        // TODO: hide existing chat
                    }
                }
            ),
            new GameOption(
                "Play chat sounds",
                "ci-ext-option-chat-sounds",
                "playSounds",
                "checkbox",
            ),
            new GameOption(
                "Show options",
                "ci-ext-option-show-options",
                "showOptions",
                "checkbox",
                {
                    resolve: function (value) {
                        console.log("Resolving showOptions value", value);
                        $("#options-show-button").toggle(value);
                        return this;
                    },
                    resolveOnLoad: true,
                }
            ),
            new GameOption(
                "Show container on hover",
                "ci-ext-option-show-hover",
                "showOnHover",
                "checkbox",
            )
        ],
        [
            "Event Filters",
            new GameOption(
                "Show normal events",
                "ci-ext-option-hide-all-normal-events",
                "showNormalEvents",
                "checkbox",
            ),
            new GameOption(
                "Show chaining events",
                "ci-ext-option-hide-all-chain-events",
                "showChainEvents",
                "checkbox",
            ),
            new GameOption(
                "Show target events",
                "ci-ext-option-hide-all-target-events",
                "showTargetEvents",
                "checkbox",
            ),
        ],
        [
            "Keybindings",
            new GameButton(
                "Edit Bindings",
                "ci-ext-open-bindings",
                function () {
                    let content = $("<div>");
                    content.css("text-align", "center");
                    let binds = Object.keys(ChatImprovements.keybinds);
                    let table = $("<table>");
                    for(let bind of binds) {
                        let tr = $("<tr>");
                        let keyCell = $("<td>")
                            .text(displayKey(ChatImprovements.keybinds[bind]));
                        let edit = NexusGUI.button("Edit bind");
                        let recordEnd = () => {
                            edit.off("click", recordEnd);
                            edit.text("Edit bind");
                            edit.click(recordStart);
                        }
                        let recordStart = () => {
                            edit.off("click", recordStart);
                            edit.text("Record");
                            edit.click(recordEnd);
                            let tempInput = $("<input>")
                                .css("height", "0px")
                                .css("width", "0px")
                                .css("overflow", "hidden");
                            let clean = () => {
                                tempInput.detach();
                                recordEnd();
                                keyCell.text(displayKey(ChatImprovements.keybinds[bind]));
                            }
                            $("body").append(tempInput);
                            tempInput.focus();
                            let data = {
                                shift: false,
                                control: false,
                                alt: false,
                                key: null,
                            };
                            tempInput.keydown((ev) => {
                                let key = ev.originalEvent.key;
                                // console.log(key);
                                if(key === "Shift") {
                                    data.shift = true;
                                }
                                else if(key === "Control") {
                                    data.control = true;
                                }
                                else if(key === "Alt") {
                                    data.alt = true;
                                }
                                else {
                                    data.key = key;
                                    ChatImprovements.keybinds[bind] = data;
                                    clean();
                                }
                                keyCell.text(displayKey(data));
                            });
                            tempInput.keyup((ev) => {
                                let key = ev.originalEvent.key;
                                // console.log(key);
                                if(key === "Shift") {
                                    data.shift = false;
                                }
                                else if(key === "Control") {
                                    data.control = false;
                                }
                                else if(key === "Alt") {
                                    data.alt = false;
                                }
                                keyCell.text(displayKey(data));
                            });
                            tempInput.focusout(() => {
                                clean();
                            });
                        };
                        edit.click(recordStart);
                        tr.append(
                            $("<td>").text(bind),
                            keyCell,
                            $("<td>").append(edit),
                        );
                        table.append(tr);
                    }
                    content.append(table);
                    NexusGUI.popup("Edit Bindings", content).then(() => {
                        
                    });
                },
            )
        ]
    ];
    
    for(let stratum of optionsColumnInfo) {
        let table = $("<table>");
        while(stratum.length && typeof stratum[0] === "string") {
            let title = stratum.shift();
            optionsColumn.append($("<h2>").text(title));
        }
        for(let option of stratum) {
            let tr = option.toElement(true);
            table.append(tr);
        }
        optionsColumn.append(table);
    }
    
    /*.click(function() {
                var a = $(this).data("option"),
                b = $(this).val();
                $("#options-" + a + "-value").text(b + "%");
                f.options[a] = b;
                f.save();
                if(jd) {
                    jd(a, b);
                }
            })*/
    
    let miscSectionButtons = $("<div id=ci-ext-misc-buttons>");
    
    // moved earlier for hideMiscBut
    let minimizeToggle = $("<button class=engine-button title=minimize>➖</button>")
        .data("toggled", false)
        .click(function () {
            let toggled = $(this).data("toggled");
            gameChatContent.toggle(toggled);
            gameChatTextbox.toggle(toggled);
            toggled = !toggled;
            $(this).data("toggled", toggled);
            scrollToBottom(gameChatContent);
        });
    
    let clearChatButton = $("<button class=engine-button title='clear chat'>🗑️</button>")
        .click(function() {
            gameChatContent.empty();
        });
    
    const hideMiscBut = function (but) {
        return function (ev) {
            for(let child of miscSections.children()) {
                let isVisible = child.id === but;
                $(child).toggle(isVisible);
                if(isVisible) {
                    scrollToBottom(child);
                }
            }
            gameChatContent.toggle(but !== "ci-ext-log" && but !== "ci-ext-event-log" && !minimizeToggle.data("toggled"));
        };
    };
    
    // button toggles for sections
    let showCardColumn = $("<button id=ci-ext-show-card-column class=engine-button>Card Info</button>");
    let showChatLog = $("<button id=ci-ext-show-chat-log class=engine-button>Chat Log</button>");
    let showEventLog = $("<button id=ci-ext-show-event-log class=engine-button>Event Log</button>");
    let showOptions = $("<button id=ci-ext-show-options class=engine-button>Options</button>");
    
    showCardColumn.click(hideMiscBut("card-column"));
    showChatLog.click(hideMiscBut("ci-ext-log"));
    showEventLog.click(hideMiscBut("ci-ext-event-log"));
    showOptions.click(hideMiscBut("ci-ext-options"));
    
    miscSectionButtons.append(showCardColumn, showChatLog, showEventLog, showOptions);
    miscContainer.append(miscSectionButtons);
    
    cardColumn.detach();
    miscSections.append(cardColumn);
    miscSections.append(chatLog);
    miscSections.append(chatEventLog);
    miscSections.append(optionsColumn);
    
    showCardColumn.click();
    
    miscContainer.append(miscSections);
    
    // update ui
    let chatContainer = $("<table id=ci-ext-chat-container>");
    miscContainer.append(chatContainer);
    
    waitForElementJQuery("#ci-ext-misc-sections:visible").then(function () {
        gameChatArea.toggle(false);
        gameChatTextbox.detach();
        gameChatContent.detach();
        gameChatContent.css("max-height", "");
        chatContainer.append(
            $("<tr>").append(
                $("<td colspan=2>").append(
                    gameChatContent
                ),
            ),
            $("<tr>").append(
                $("<td id=ci-ext-chat-cell>").append(gameChatTextbox),
                $("<td id=ci-ext-chat-buttons-cell>").append(
                    minimizeToggle, clearChatButton
                )
            )
        );
    });
    
    // listeners[type] = [...];
    let listeners = {};
    ChatImprovements.addEventListener = function (ev, cb) {
        // TODO: verify
        listeners[ev] = listeners[ev] || [];
        listeners[ev].push(cb);
    };
    ChatImprovements.triggerListener = function (ev, ...args) {
        console.log(listeners, ev);
        try {
            for(let cb of listeners[ev]) {
                cb(...args);
            }
        } catch(e) {
            console.warn(e);
        }
    };
    // reference
    const log = ChatImprovements.log;
    Game.messageQueue.shift = function (...args) {
        let res = Array.prototype.shift.apply(Game.messageQueue, args);
        log.push(res);
        if(typeof res.length !== "undefined") {
            alert("whoa! unexpected arguments passed to Game.messageQueue.shift!");
        }
        let eventType = res.type;
        if(listeners[eventType]) {
            for(let cb of listeners[eventType]) {
                cb(res);
            }
        }
        return res;
    }
    
    const Events = {
        CHAIN: "chain",
        NORMAL: "normal",
        TARGET: "target",
    };
    const notificationColors = {
        [Events.NORMAL]: "#00FF00",
        [Events.CHAIN]: "#7FF17F",
        [Events.TARGET]: "#B0FAB0",
    };
    const notificationPrefixes = {
        [Events.NORMAL]: "Event: ",
        [Events.CHAIN]: "",
        [Events.TARGET]: "Target: ",
    };
    const eventEnabledKeys = {
        [Events.NORMAL]: "showNormalEvents",
        [Events.CHAIN]: "showChainEvents",
        [Events.TARGET]: "showTargetEvents",
    };
    const notifyEvent = function (event, kind = Events.NORMAL) {
        let prefix = notificationPrefixes[kind];
        let color = notificationColors[kind];
        let message = displayMessage(prefix + event, color, "notified-event", "event-" + kind);
        
        let enabledKey = eventEnabledKeys[kind];
        message.toggle(ChatImprovements[enabledKey]);
    };
    
    const GameLocations = {
        TOKEN_PILE: 0,
        DECK: 1,
        HAND: 2,
        FIELD_MONSTER: 4,
        FIELD_SPELLTRAP: 8,
        FIELD: 4 | 8,
        GY: 16,
        BANISHED: 32,
        EXTRA_DECK: 64,
        XYZ_MATERIAL: 128,
    };
    const LocationNames = {
        [GameLocations.TOKEN_PILE]: "token pile",
        [GameLocations.DECK]: "the Deck",
        [GameLocations.HAND]: "the hand",
        [GameLocations.FIELD_MONSTER]: "a Monster Zone",
        [GameLocations.FIELD_SPELLTRAP]: "a Spell & Trap Zone",
        [GameLocations.GY]: "the GY",
        [GameLocations.BANISHED]: "being banished",
        [GameLocations.EXTRA_DECK]: "the Extra Deck",
        192: " an Xyz Monster [bugged response, please report!]",
    };
    
    let cardCodeToSkip = null;
    
    let movedFromTo = function (move, start, end) {
        return (move.previousLocation & start) !== 0 &&
               (move.currentLocation & end) !== 0;
    }
    ChatImprovements.addEventListener("GameMove", function (move) {
        let cardName = move.cardCode ? "#@" + move.cardCode : "A card";
        if(move.cardCode) {
            cardCodeToSkip = move.cardCode;
        }
        // sent to GY
        if(movedFromTo(move, GameLocations.XYZ_MATERIAL, GameLocations.GY) ||
           movedFromTo(move, GameLocations.XYZ_MATERIAL, GameLocations.BANISHED)) {
            status = "was detached as Xyz Material"
        }
        else if(move.currentLocation === GameLocations.GY) {
            status = "was sent to the GY from " + LocationNames[move.previousLocation];
        }
        // returned to the deck
        else if(move.currentLocation === GameLocations.DECK) {
            status = "was shuffled/placed into the Deck from " + LocationNames[move.previousLocation];
        }
        // returned to the extra deck
        else if(move.currentLocation === GameLocations.EXTRA_DECK) {
            status = "was returned to the Extra Deck from " + LocationNames[move.previousLocation];
        }
        // attached as xyz material?
        else if(move.currentLocation & GameLocations.XYZ_MATERIAL) {
            status = "was attached as Xyz Material from " + LocationNames[move.previousLocation];
        }
        // banished
        else if(move.currentLocation === GameLocations.BANISHED) {
            status = "was banished from " + LocationNames[move.previousLocation];
        }
        // sent to hand
        else if(movedFromTo(move, GameLocations.GY, GameLocations.HAND)) {
            // console.log("why??????");
            status = "was returned from the GY to the hand";
        }
        else if(movedFromTo(move, GameLocations.DECK, GameLocations.HAND)) {
            status = "was added from the Deck to the hand";
        }
        else if(movedFromTo(move, GameLocations.BANISHED, GameLocations.HAND)) {
            status = "was added to the hand from being banished";
        }
        else if(movedFromTo(move, GameLocations.FIELD, GameLocations.HAND)) {
            status = "was returned from the field to the hand";
        }
        else if(movedFromTo(move, GameLocations.EXTRA_DECK, GameLocations.HAND)) {
            status = "was added to the hand from the face-up Extra Deck";
        }
        // monster summons
        else if(move.currentLocation === GameLocations.FIELD_MONSTER) {
            status = "was Summoned from " + LocationNames[move.previousLocation];
        }
        // spell card activations
        else if(move.currentLocation === GameLocations.FIELD_SPELLTRAP) {
            // TODO: set vs. activate
            // console.log(move);
            status = "was activated/set from " + LocationNames[move.previousLocation];
        }
        else if(movedFromTo(move, GameLocations.FIELD, GameLocations.TOKEN_PILE)) {
            status = "was removed from the field";
        }
        else {
            // 0 from 4
            status = "- UNSURE!! " + move.currentLocation + " from " + move.previousLocation;
        }
        notifyEvent(cardName + " " + status);
        // TODO: more
    });
    
    ChatImprovements.addEventListener("cfReveal", function (code) {
        if(code && code !== cardCodeToSkip) {
            notifyEvent("Revealed #@" + code);
        }
        cardCodeToSkip = null;
    });
    
    ChatImprovements.addEventListener("targetCard", function (event) {
        let size = event.cards.length;
        for(let i = 0; i < size; i++) {
            try {
                let { controller, location, sequence } = event.cards[i];
                let card = Game.getCard(controller, location, sequence);
                let message = "";
                if(size !== 1) {
                    message = `[${i + 1}/${size}] `;
                }
                message += "#@" + card.code;
                notifyEvent(message, Events.TARGET);
            } catch(e) {
                console.warn(e);
            }
        }
    });
    
    // still a mystery to me
    // originally: - 24
    const RESIZE_OFFSET = 10;
    const getBaseHeight = () => {
        let upperMargin = $("#ci-ext-misc-sections").position().top;
        let baseHeight = $(window).height() - upperMargin - RESIZE_OFFSET;
        return baseHeight;
    };
    let updateColumnHeight = function () {
        let diffHeight = getBaseHeight() - chatContainer.height();
        $("#ci-ext-misc-sections > div").css("height",
            roundTo(diffHeight)
        );
    };
    
    let UCH_INT = setInterval(updateColumnHeight, 50);
    console.log("Update Column Height Interval ID:", UCH_INT);
    
    // redefine window resizing
    
    let resize = function resize () {
        if(!Game.fields[0]) {
            return;
        }
        
        var a = $("#ci-ext-misc-sections").position().top;
        // $("#card-column").css("max-height", $(window).height() - a - 24);
        $("#game-siding-column").css("max-height", 
            roundTo(getBaseHeight())
        );
        
        
        a = 4 <= Game.masterRule ? 7 : 6;
        var b =
            $(window).width() - $("#ci-ext-misc-sections > div").width() - 50,
            c = $(window).height() - $("#game-chat-area").height() - 8 - 48;
        9 * c / a < b ? ($("#game-field").css("height", c + "px"), b = c / a, $("#game-field").css("width", 9 * b + "px")) : ($("#game-field").css("width", b + "px"), b /= 9, $("#game-field").css("height", b * a + "px"));
        $(".game-field-zone").css("width", b + "px").css("height", b + "px");
        $(".game-field-hand").css("width", 5 * b + "px").css("height", b + "px");
        Game.zoneWidth = b;
        Game.cardHeight = Math.floor(.95 * b);
        Game.cardWidth = Game.cardHeight * Engine.CARD_WIDTH /
            Engine.CARD_HEIGHT;
        Game.fields[0].resizeHand();
        Game.fields[1].resizeHand();
        $("#game-position-atk-up").css("width", Game.cardWidth);
        $("#game-position-atk-up").css("height", Game.cardHeight);
        $("#game-position-atk-up").css("margin-right", Game.cardHeight - Game.cardWidth + 3);
        $("#game-position-atk-down").css("width", Game.cardWidth);
        $("#game-position-atk-down").css("height", Game.cardHeight);
        $("#game-position-atk-down").css("margin-right", Game.cardHeight - Game.cardWidth + 3);
        $("#game-position-def-up").css("width",
            Game.cardWidth);
        $("#game-position-def-up").css("height", Game.cardHeight);
        $("#game-position-def-up").css("margin-right", Game.cardHeight - Game.cardWidth + 3);
        $("#game-position-def-down").css("width", Game.cardWidth);
        $("#game-position-def-down").css("height", Game.cardHeight);
        $(".game-selection-card-image").css("width", Game.cardWidth);
        Game.isSiding && Game.sidingResize()
    };
    
    /*
    let resize = function resize() {
        if(!m[0]) {
            return;
        }
        $("#game-siding-column").css("max-height", 
            roundTo(getBaseHeight())
        );
        let a = 4 <= Ab ? 7 : 6;
        let b = $(window).width() - $("#ci-ext-misc").width() - 50;
        let c = $(window).height() - 8 - 48 - RESIZE_OFFSET;
            // c = $(window).height();// - $("#game-chat-area").height() - 8 - 48;
            // c = $(window).height() - $("#game-chat-textbox").outerHeight() - 8 - 48;
        if(9 * c / a < b) {
            $("#game-field").css("height", c + "px");
            b = c / a;
            $("#game-field").css("width", 9 * b + "px");
        }
        else {
            $("#game-field").css("width", b + "px");
            b /= 9;
            $("#game-field").css("height", b * a + "px");
        }
        
        $(".game-field-zone").css("width", b + "px").css("height", b + "px");
        $(".game-field-hand").css("width", 5 * b + "px").css("height", b + "px");
        
        Cb = b;
        Db = Math.floor(.95 * b);
        E = 177 * Db / 254;
        
        Zc(m[0]);
        Zc(m[1]);
        
        $("#game-position-atk-up").css("width", E);
        $("#game-position-atk-up").css("height", Db);
        $("#game-position-atk-up").css("margin-right", Db - E + 3);
        $("#game-position-atk-down").css("width", E);
        $("#game-position-atk-down").css("height", Db);
        $("#game-position-atk-down").css("margin-right", Db - E + 3);
        $("#game-position-def-up").css("width", E);
        $("#game-position-def-up").css("height", Db);
        $("#game-position-def-up").css("margin-right", Db - E + 3);
        $("#game-position-def-down").css("width", E);
        $("#game-position-def-down").css("height", Db);
        $(".game-selection-card-image").css("width", E);
        if(zb) {
            $c();
        }
    }
    */
    window.Wb = function Wb() {
        try {
            resize();
        }
        catch (e) {
            console.warn("Error while window resizing (probably safe to ignore if everything is working)");
            console.warn(e);
        }
    }
    $(window).off("resize");
    $(window).resize(Wb);
    
    let oldOnTarget = Game.onGameBecomeTarget;
    
    // most of the source copied from the nice source
    Game.onGameBecomeTarget = function (message) {
        ChatImprovements.triggerListener("targetCard", message);
        let flashNext = function (i) {
            if (i == message['cards'].length) {
                Game.parseNextMessage();
                return;
            }
            var cardInfo = message['cards'][i];
            if (!cardInfo['location'] & CardLocation.ON_FIELD) {
                flashNext(i + 1);
                return;
            }
            var card = Game.getCard(cardInfo['controller'], cardInfo['location'], cardInfo['sequence']);
            card.animateSelection(function () { flashNext(i + 1); });
        };
        flashNext(0);
        return true;
    };
    Game.messageHandlers.GameBecomeTarget = Game.onGameBecomeTarget;
    
    Game.Card.prototype.animateSelection = function (cb) {
        let originalZ = this.imgElement.css("z-index");
        let callback = () => {
            console.log("CALLING BACK!");
            cb();
        };
        this.imgElement
            .css("z-index", 10000)
            .css("animation",
                "fullScale " + (600 * Game.animationSpeedMultiplier) + "ms"
            );
        this.imgElement.animate({
            opacity: .5
        }, {
            duration: 100 * Game.animationSpeedMultiplier
        }).animate({
            opacity: 1
        }, {
            duration: 100 * Game.animationSpeedMultiplier
        }).animate({
            opacity: .5
        }, {
            duration: 100 * Game.animationSpeedMultiplier
        }).animate({
            opacity: 1
        }, {
            duration: 100 * Game.animationSpeedMultiplier
        }).animate({
            opacity: .5
        }, {
            duration: 100 * Game.animationSpeedMultiplier
        }).animate({
            opacity: 1
        }, {
            duration: 100 * Game.animationSpeedMultiplier,
            complete: () => {
                this.imgElement.css("animation", "")
                               .css("z-index", originalZ);
                console.log("Completing animation");
                if(callback) {
                    callback();
                }
            }
        });
    };
    
    window.df = function df(a, b, c, d, e) {
        // TODO: fix
        // if(listeners["cfReveal"]) {
            // for(let cb of listeners["cfReveal"]) {
                // cb(b);
            // }
        // }
        // var g = a.a.offset(),
            // k = a.location & O.j || c & 5 ? b : 0,
            // w = hg(a.controller, a.location, c) - a.va,
            // F = false;
        // if(a.Kb !== k) {
            // F = true;
        // }
        // if(null !== a.b) {
            // a.b.hide();
            // a.K.hide();
        // }
        // a.code = b;
        // a.position = c;
        // $("<div />").animate({
            // height: 1
        // }, {
            // duration: d,
            // step: function(b, c) {
                // b = c.pos;
                // c = "translate(";
                // c += (a.ta.left - g.left) * (1 - b);
                // c += "px, ";
                // c += (a.ta.top - g.top) * (1 - b);
                // c += "px)";
                // c += " rotate(" + (a.va + w * b) + "deg)";
                // if(F) {
                    // if(.5 < b) {
                        // ig(a, k);
                    // }
                    // c += " scalex(" + Math.abs(1 - 2 * b) + ")";
                // }
                // a.a.css("transform", c)
            // },
            // complete: function() {
                // null !== a.b && (a.b.show(), a.K.show());
                // a.a.css("position",
                    // "");
                // nf(a);
                // e()
            // }
        // })
    }
    
    // re-add listener
    // remove current resize listener
    Game.immediateHandlers.ChatMessageReceived = Game.onChatMessageReceived = displayOpponentsMessage;
    console.info("ChatImprovements plugin loaded!");
    
    //
    let overlayExtension;
    $(".game-field-zone").on("mouseover", function (ev) {
        let player = $(this).data("player");
        let location = $(this).data("location");
        let index = $(this).data("index");
        let card = Game.getCard(player, location, index);
        if(!card) return;
        let overlays = card.l;
        if(!overlayExtension) {
            overlayExtension = $("<p id=game-tooltip-overlay-extension></p>");
            $("#game-tooltip .card-if-monster").append(overlayExtension);
        }
        if(overlays && overlays.length) {
            $(overlayExtension).empty();
            let { width, height } = this.querySelector("img");
            console.log("width, height:", width, height);
            let plural = overlays.length === 1 ? "" : "s";
            let msg = "[" + overlays.length.toString() + " material" + plural + "]\n";
            $(overlayExtension).append($("<p>" + msg + "</p>"));
            for(let overlay of overlays) {
                let imgSrc = window.Engine.getCardPicturePath(overlay.code);
                let img = $("<img class=material-preview src='" + imgSrc + "' width=" + width + " height=" + height + ">");
                // img.width = width;
                // img.height = height;
                $(overlayExtension).append(img);
            }
            $(overlayExtension).show();
        }
        else {
            $(overlayExtension).hide();
        }
    });
    $(".game-field-zone").on("mouseout", function (ev) {
        $(overlayExtension).hide();
    });
    
    // hide sleeves/profile picture
    
    const BLACK_SQUARE_IMAGE = "https://images.squarespace-cdn.com/content/v1/55fc0004e4b069a519961e2d/1442590746571-RPGKIXWGOO671REUNMCB/ke17ZwdGBToddI8pDm48kKVo6eXXpUnmuNsFtLxYNDVZw-zPPgdn4jUwVcJE1ZvWhcwhEtWJXoshNdA9f1qD7abfyk2s94xLLkDA7TSo2rckMlGDU48FfF-V7lLcSuGNU_Uf7d6wOiJwP-LWX64gbQ/image-asset.gif?format=300w";
    for(let avatar of $(".game-avatar")) {
        avatar = $(avatar);
        avatar.data("visible", true);
        avatar.css("cursor", "pointer");
        avatar.click(() => {
            if(avatar.data("visible")) {
                avatar.data("original-source", avatar.attr("src"));
                avatar.attr("src", BLACK_SQUARE_IMAGE);
            }
            else {
                avatar.attr("src", avatar.data("original-source"));
            }
            avatar.data("visible", !avatar.data("visible"));
        });
    }
    
    // TODO: revert
    $("#game-field-opponent-deck").click(() => {
        let opponentName = $("#game-opponent-name").text();
        let opponent = B.find(player => player.name === opponentName);
        
        if(opponent.oa) {
            opponent.old_oa = opponent.oa;
            opponent.oa = null;
            for(let card of $(".game-field-card")) {
                if($(card).data("controller") !== 0 && card.src.indexOf(opponent.old_oa) !== -1) {
                    card.src = "assets/images/cover.png";
                }
            }
        }
    });
};

waitForElementJQuery("#game-room-container:visible, #game-field:visible").then(() => {
    onload();
});
// on-load stuff
