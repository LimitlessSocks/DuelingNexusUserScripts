// ==UserScript==
// @name         DuelingNexus Chat Improvements Plugin
// @namespace    https://duelingnexus.com/
// @version      0.1
// @description  Adds various support for categorizing decks.
// @author       Sock#3222
// @grant        none
// @match        https://duelingnexus.com/game/*
// ==/UserScript==

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
    playSounds: true,
    showEvents: true,
};
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
    const playSound = Q;
    const sendEvent = K;
    const gameChatContent = $("#game-chat-content");
    const gameChatTextbox = $("#game-chat-textbox");
    const gameChatArea = $("#game-chat-area");
    const showCardInColumn = Bc;
    
    const monsterTypeMap = {};
    for(let key in Vf) {
        let value = Vf[key];
        monsterTypeMap[value] = parseInt(key, 10);
    }
    window.monsterTypeMap = monsterTypeMap;
    const isTrapCard            = (card) => card.type & monsterTypeMap["Trap"];
    const isSpellCard           = (card) => card.type & monsterTypeMap["Spell"];    const isMonster             = (card) => !isTrapCard(card) && !isSpellCard(card);
    const isToken               = (card) => card.type & monsterTypeMap["Token"];
    const isXyzMonster          = (card) => card.type & monsterTypeMap["Xyz"];
    const isPendulumMonster     = (card) => card.type & monsterTypeMap["Pendulum"];
    const isLinkMonster         = (card) => card.type & monsterTypeMap["Link"];
    const isFusionMonster       = (card) => card.type & monsterTypeMap["Fusion"];
    const isRitualMonster       = (card) => isMonster(card) && (card.type & monsterTypeMap["Ritual"]);
    const isSynchroMonster      = (card) => card.type & monsterTypeMap["Synchro"];
    const isNormalMonster       = (card) => card.type & monsterTypeMap["Normal"];

    gameChatContent.css("overflow-y", "auto")
                   .css("height", "230px")
                   .css("background-color", "transparent");
    gameChatArea.css("background-color", "rgba(0, 0, 0)")
                .css("background-color", "rgba(0, 0, 0, 0.7)");
    
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
    
    const MESSAGE_PARSE_REGEX = /#@(\d+)|.+?/g;
    let colorOfCard = function (card) {
        if(isTrapCard(card)) {
            return "#BC5A84";
        }
        else if(isSpellCard(card)) {
            return "#1D9E74";
        }
        else {
            return "#B83D00";
        }
    }
    let displayMessage = function (content, color, kind) {
        //showCardInColumn
        let matches;
        let message = $("<p>");
        while(matches = MESSAGE_PARSE_REGEX.exec(content)) {
            let id = parseInt(matches[1]);
            let card = X[id];
            if(id && card) {
                let interactive = $("<span>")
                    .css("color", "white")
                    .css("background-color", colorOfCard(card));
                interactive.hover(function () {
                    showCardInColumn(id);
                });
                interactive.text('"' + card.name + '"');
                message.append(interactive);
            }
            else {
                message.append(matches[0]);
            }
        }
        if(kind) {
            message.addClass(kind);
        }
        gameChatContent.append(message);
        // scroll to message
        gameChatContent.animate({
            scrollTop: gameChatContent.prop("scrollHeight")
        }, 150);
        if(color) {
            message.css("color", color);
        }
        return message;
    }
    ChatImprovements.displayMessage = displayMessage;
    
    // overwrite send message
    window.sd = displayMessage;
    
    let unifyMessage = function (message) {
        return timestamp() + " " + message;
    }
    
    let displayOpponentsMessage = function (a) {
        if(ChatImprovements.playSounds) {
            playSound("chat-message");
        }
        let playerId = a.playerId;
        let message = a.message;
        let color;
        
        if(0 <= playerId && 3 >= playerId) {
            let name = A[playerId].name;
            message = "[" + name + "]: " + message;
        }
        else {
            color = "yellow";
        }
        
        message = unifyMessage(message);
        displayMessage(message, color);
    }
    
    gameChatTextbox.unbind();
    gameChatTextbox.keyup(function(ev) {
        if(ev.keyCode == 13) {
            let message = gameChatTextbox.val();
            gameChatTextbox.val("");
            sendEvent({
                type: "SendChatMessage",
                message: message
            });
            message = unifyMessage("[" + Hb + "]: " + message);
            if(4 > z) {
                displayMessage(message);
            }
            else {
                displayMessage(message, "yellow");
            }
        }
    });
    
    // update ui
    let minimizeToggle = $("<button class=engine-button title=minimize>&minus;</button>")
        .click(function () {
            gameChatContent.toggle();
            gameChatTextbox.toggle();
        });
    
    let muteToggle = $("<button class=engine-button>Mute</button>")
        .click(function () {
            muteToggle.text(ChatImprovements.playSounds ? "Unmute" : "Mute");
            ChatImprovements.playSounds = !ChatImprovements.playSounds;
        })
        .css("float", "right");
    
    let notificationToggle = $("<button class=engine-button>Hide events</button>")
        .click(function () {
            notificationToggle.text(ChatImprovements.showEvents ? "Show events" : "Hide events");
            ChatImprovements.showEvents = !ChatImprovements.showEvents;
            $(".notified-event").toggle(ChatImprovements.showEvents);
        })
        .css("float", "right");
    // let 
    gameChatArea.prepend(
        minimizeToggle, muteToggle, notificationToggle
    )
    
    // listeners[type] = [...];
    let listeners = {};
    ChatImprovements.addEventListener = function (ev, cb) {
        // TODO: verify
        listeners[ev] = listeners[ev] || [];
        listeners[ev].push(cb);
    }
    // reference
    const log = ChatImprovements.log;
    sb.shift = function (...args) {
        let res = Array.prototype.shift.apply(sb, args);
        log.push(res);
        if(typeof res.length !== "undefined") {
            alert("whoa! unexpected arguments passed to sb.shift!");
        }
        let eventType = res.type;
        if(listeners[eventType]) {
            for(let cb of listeners[eventType]) {
                cb(res);
            }
        }
        return res;
    }
    
    const notifyEvent = function (event) {
        let message = displayMessage("Event: " + event, "#00FF00", "notified-event");
        if(!ChatImprovements.showEvents) {
            message.toggle(false);
        }
    }
    
    const GameLocations = {
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
        [GameLocations.DECK]: "the Deck",
        [GameLocations.HAND]: "the hand",
        [GameLocations.FIELD_MONSTER]: "a Monster Zone",
        [GameLocations.FIELD_SPELLTRAP]: "a Spell & Trap Zone",
        [GameLocations.GY]: "the GY",
        [GameLocations.BANISHED]: "being banished",
        [GameLocations.EXTRA_DECK]: "the Extra Deck",
        192: " an Xyz Monster [bugged response, please report!]",
    };
    
    let movedFromTo = function (move, start, end) {
        return (move.previousLocation & start) !== 0 &&
               (move.currentLocation & end) !== 0;
    }
    ChatImprovements.addEventListener("GameMove", function (move) {
        let cardName = move.cardCode ? "#@" + move.cardCode : "A card";
        // sent to GY
        console.log(GameLocations.GY);
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
            console.log("why??????");
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
        // monster summons
        else if(move.currentLocation === GameLocations.FIELD_MONSTER) {
            status = "was Summoned from " + LocationNames[move.previousLocation];
        }
        // spell card activations
        else if(move.currentLocation === GameLocations.FIELD_SPELLTRAP) {
            // TODO: set vs. activate
            status = "was activated/set from " + LocationNames[move.previousLocation];
        }
        else {
            status = "- UNSURE!! " + move.currentLocation + " from " + move.previousLocation;
        }
        notifyEvent(cardName + " " + status);
        // TODO: more
    });
    
    
    // redefine window resizing
    window.Vb = function Vb() {
        var a = $("#card-column").position().top;
        
        $("#card-column")
            .css("max-height", $(window).height() - a - 24);
        $("#game-siding-column")
            .css("max-height", $(window).height() - a - 24);
        
        a = 4 === D ? 7 : 6;
        var b = $(window).width() - $("#card-column").width() - 50,
            // c = $(window).height();// - $("#game-chat-area").height() - 8 - 48;
            c = $(window).height() - 8 - 48;
        9 * c / a < b ? ($("#game-field").css("height", c + "px"), b = c / a, $("#game-field").css("width", 9 * b + "px")) : ($("#game-field").css("width", b + "px"), b /= 9, $("#game-field").css("height", b * a + "px"));
        $(".game-field-zone").css("width",
            b + "px").css("height", b + "px");
        $(".game-field-hand").css("width", 5 * b + "px").css("height", b + "px");
        Cb = b;
        Db = Math.floor(.95 * b);
        E = 177 * Db / 254;
        Yc(m[0]);
        Yc(m[1]);
        $("#game-position-atk-up").css("width", E);
        $("#game-position-atk-up").css("height", Db);
        $("#game-position-atk-up").css("margin-right", Db - E + 3);
        $("#game-position-atk-down").css("width", E);
        $("#game-position-atk-down").css("height", Db);
        $("#game-position-atk-down").css("margin-right", Db - E + 3);
        $("#game-position-def-up").css("width", E);
        $("#game-position-def-up").css("height",
            Db);
        $("#game-position-def-up").css("margin-right", Db - E + 3);
        $("#game-position-def-down").css("width", E);
        $("#game-position-def-down").css("height", Db);
        $(".game-selection-card-image").css("width", E);
        Ab && Zc();
    }
    
    // re-add listener
    // remove current resize listener
    // $(window).off("resize", Vb);
    // $(window).resize(Vb);
    Fb.ChatMessageReceived = window.pd = displayOpponentsMessage;
    console.info("ChatImprovements plugin loaded!");
};

waitForElementJQuery("#game-room-container:visible").then(() => {
    onload();
});
// on-load stuff
