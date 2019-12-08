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
    }
    
    #ci-ext-misc-sections > div {
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
    }
    
    #ci-ext-log > p, #ci-ext-event-log > p {
        padding: 0;
        margin: 3px;
    }
    
    #ci-ext-log, #ci-ext-event-log {
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
    </style>`));
    
    // boilerplate
    const playSound = Q;
    const sendEvent = K;
    const gameChatContent = $("#game-chat-content");
    const gameChatTextbox = $("#game-chat-textbox");
    const gameChatArea = $("#game-chat-area");
    const showCardInColumn = Cc;
    const SECONDS = 1000;
    
    const monsterTypeMap = {};
    for(let key in Vf) {
        let value = Vf[key];
        monsterTypeMap[value] = parseInt(key, 10);
    }
    window.monsterTypeMap = monsterTypeMap;
    const isTrapCard            = (card) => card.type & monsterTypeMap["Trap"];
    const isSpellCard           = (card) => card.type & monsterTypeMap["Spell"];
    const isMonster             = (card) => !isTrapCard(card) && !isSpellCard(card);
    const isToken               = (card) => card.type & monsterTypeMap["Token"];
    const isXyzMonster          = (card) => card.type & monsterTypeMap["Xyz"];
    const isPendulumMonster     = (card) => card.type & monsterTypeMap["Pendulum"];
    const isLinkMonster         = (card) => card.type & monsterTypeMap["Link"];
    const isFusionMonster       = (card) => card.type & monsterTypeMap["Fusion"];
    const isRitualMonster       = (card) => isMonster(card) && (card.type & monsterTypeMap["Ritual"]);
    const isSynchroMonster      = (card) => card.type & monsterTypeMap["Synchro"];
    const isNormalMonster       = (card) => card.type & monsterTypeMap["Normal"];

    // gameChatContent.css("overflow-y", "auto")
                   // .css("height", "230px")
                   // .css("background-color", "transparent");
    // gameChatArea.css("background-color", "rgba(0, 0, 0)")
                // .css("background-color", "rgba(0, 0, 0, 0.7)");
    let chatLog = $("<div id=ci-ext-log>");
    let chatEventLog = $("<div id=ci-ext-event-log>");
    
    
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
        if(color) {
            message.css("color", color);
        }
        gameChatContent.append(message);
        let copy = message.clone();
        if(kind === "notified-event") {
            chatEventLog.append(copy);
        }
        else {
            chatLog.append(copy);
        }
        // scroll to message
        scrollToBottom(chatLog);
        // handle UI
        if(gameChatContent.children().length > 10) {
            gameChatArea.find("p:first").remove();
        }
        setTimeout(function() {
            message.remove();
        }, 10 * SECONDS);
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
            playSound("chat-message");
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
    
    gameChatTextbox.unbind();
    gameChatTextbox.keyup(function(ev) {
        if(ev.keyCode == 13) {
            let message = gameChatTextbox.val();
            gameChatTextbox.val("");
            sendEvent({
                type: "SendChatMessage",
                message: message
            });
            message = unifyMessage("[" + Ib + "]: " + message);
            if(4 > z) {
                displayMessage(message);
            }
            else {
                displayMessage(message, "yellow");
            }
        }
    });
    
    // create sections
    let miscContainer = $("<div id=ci-ext-misc>");
    let miscSections = $("<div id=ci-ext-misc-sections>");
    let cardColumn = $("#card-column");
    let gameContainer = $("#game-container");
    gameContainer.prepend(miscContainer);
    
    let miscSectionButtons = $("<div id=ci-ext-misc-buttons>");
    
    const hideMiscBut = function (but) {
        return function (ev) {
            for(let child of miscSections.children()) {
                let isVisible = child.id === but;
                $(child).toggle(isVisible);
                if(isVisible) {
                    scrollToBottom(child);
                }
            }
            gameChatContent.toggle(but !== "ci-ext-log" && but !== "ci-ext-event-log");
        };
    };
    
    // button toggles for sections
    let showCardColumn = $("<button id=ci-ext-show-card-column class=engine-button>Card Info</button>");
    let showChatLog = $("<button id=ci-ext-show-chat-log class=engine-button>Chat Log</button>");
    let showEventLog = $("<button id=ci-ext-show-event-log class=engine-button>Event Log</button>");
    
    showCardColumn.click(hideMiscBut("card-column"));
    showChatLog.click(hideMiscBut("ci-ext-log"));
    showEventLog.click(hideMiscBut("ci-ext-event-log"));
    
    miscSectionButtons.append(showCardColumn, showChatLog, showEventLog);
    miscContainer.append(miscSectionButtons);
    
    cardColumn.detach();
    miscSections.append(cardColumn);
    miscSections.append(chatLog);
    miscSections.append(chatEventLog);
    showCardColumn.click();
    miscContainer.append(miscSections);
    
    /*
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
    */
    
    // listeners[type] = [...];
    let listeners = {};
    ChatImprovements.addEventListener = function (ev, cb) {
        // TODO: verify
        listeners[ev] = listeners[ev] || [];
        listeners[ev].push(cb);
    }
    // reference
    const log = ChatImprovements.log;
    rb.shift = function (...args) {
        let res = Array.prototype.shift.apply(rb, args);
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
            status = "was activated/set from " + LocationNames[move.previousLocation];
        }
        else if(movedFromTo(move, GameLocations.FIELD, GameLocations.TOKEN_PILE)) {
            status = "was removed from the field";
        }
        else {
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
    
    ChatImprovements.addEventListener("targetCardAnimation", function (code) {
        if(code) {
            notifyEvent("Targeted #@" + code);
        }
    });
    
    
    // redefine window resizing
    window.Wb = function Wb() {
        var a = $("#ci-ext-misc-sections").position().top;
        
        // originally: - 24
        const offset = 24;
        $("#ci-ext-misc-sections div")
            .css("max-height", $(window).height() - a - offset);
        $("#game-siding-column")
            .css("max-height", $(window).height() - a - offset);
        
        a = 4 === Ab ? 7 : 6;
        var b = $(window).width() - $("#ci-ext-misc").width() - 50,
            // c = $(window).height();// - $("#game-chat-area").height() - 8 - 48;
            c = $(window).height() - $("#game-chat-textbox").outerHeight() - 8 - 48;
        9 * c / a < b ? ($("#game-field").css("height", c + "px"), b = c / a, $("#game-field").css("width", 9 * b + "px")) : ($("#game-field").css("width", b + "px"), b /= 9, $("#game-field").css("height", b * a + "px"));
        $(".game-field-zone").css("width",
            b + "px").css("height", b + "px");
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
        $("#game-position-def-up").css("height",
            Db);
        $("#game-position-def-up").css("margin-right", Db - E + 3);
        $("#game-position-def-down").css("width", E);
        $("#game-position-def-down").css("height", Db);
        $(".game-selection-card-image").css("width", E);
        zb && $c();
    }
    
    window.qf = function qf(a, b) {
        if(listeners["targetCardAnimation"]) {
            for(let cb of listeners["targetCardAnimation"]) {
                cb(a.code);
            }
        }
        let originalZ = a.a.css("z-index");
        a.a.css("z-index", 10000)
           .css("animation", "fullScale " + (600 * B) + "ms");
        a.a.animate({
            opacity: .5
        }, {
            duration: 100 * B
        }).animate({
            opacity: 1
        }, {
            duration: 100 * B
        }).animate({
            opacity: .5
        }, {
            duration: 100 * B
        }).animate({
            opacity: 1
        }, {
            duration: 100 * B
        }).animate({
            opacity: .5
        }, {
            duration: 100 * B
        }).animate({
            opacity: 1
        }, {
            duration: 100 * B,
            complete: function () {
                a.a.css("animation", "")
                   .css("z-index", originalZ);
                if(b) {
                    b();
                }
            }
        });
    };
    
    window.df = function df(a, b, c, d, e) {
        if(listeners["cfReveal"]) {
            for(let cb of listeners["cfReveal"]) {
                cb(b);
            }
        }
        var g = a.a.offset(),
            k = a.location & O.j || c & 5 ? b : 0,
            w = hg(a.controller, a.location, c) - a.va,
            F = false;
        if(a.Kb !== k) {
            F = true;
        }
        if(null !== a.b) {
            a.b.hide();
            a.K.hide();
        }
        a.code = b;
        a.position = c;
        $("<div />").animate({
            height: 1
        }, {
            duration: d,
            step: function(b, c) {
                b = c.pos;
                c = "translate(";
                c += (a.ta.left - g.left) * (1 - b);
                c += "px, ";
                c += (a.ta.top - g.top) * (1 - b);
                c += "px)";
                c += " rotate(" + (a.va + w * b) + "deg)";
                if(F) {
                    if(.5 < b) {
                        ig(a, k);
                    }
                    c += " scalex(" + Math.abs(1 - 2 * b) + ")";
                }
                a.a.css("transform", c)
            },
            complete: function() {
                null !== a.b && (a.b.show(), a.K.show());
                a.a.css("position",
                    "");
                nf(a);
                e()
            }
        })
    }
    
    // re-add listener
    // remove current resize listener
    // $(window).off("resize", Vb);
    // $(window).resize(Vb);
    Fb.ChatMessageReceived = window.qd = displayOpponentsMessage;
    console.info("ChatImprovements plugin loaded!");
    
    //
    let overlayExtension;
    $(".game-field-zone").on("mouseover", function (ev) {
        let player = $(this).data("player");
        let location = $(this).data("location");
        let index = $(this).data("index");
        let card = T(player, location, index);
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
                let imgSrc = ra(overlay.code);
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
};

waitForElementJQuery("#game-room-container:visible").then(() => {
    onload();
});
// on-load stuff
