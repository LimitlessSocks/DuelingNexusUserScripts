// ==UserScript==
// @name         Dueling Nexus Notification System
// @namespace    https://duelingnexus.com/
// @version      0.2.7
// @description  Gives desktop notifications for joining matches.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/
// @include      https://duelingnexus.com/decks
// @include      https://duelingnexus.com/home
// @include      https://duelingnexus.com/duel
// @include      https://duelingnexus.com/profile
// @include      https://duelingnexus.com/hostgame
// @include      https://duelingnexus.com/gamelist
// @include      https://duelingnexus.com/donate
// @include      https://duelingnexus.com/leaderboard
// @include      https://duelingnexus.com/login
// @include      https://duelingnexus.com/game/*
// @updateURL    https://github.com/LimitlessSocks/DuelingNexusUserScripts/raw/master/beta/Notifications/nexus-notifications.user.js
// @downloadURL  https://github.com/LimitlessSocks/DuelingNexusUserScripts/raw/master/beta/Notifications/nexus-notifications.user.js
// ==/UserScript==

console.info = console.info || console.log;

let waitFrame = function () {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
};

const waitForElement = async function (selector, source = document.body) {
    let query;
    while ((query = source.querySelector(selector)) === null) {
        await waitFrame();
    }
    return query;
};

const waitForNoElement = async function (selector, source = document.body) {
    while (source.querySelector(selector) !== null) {
        await waitFrame();
    }
    return;
};

let formatTime = function(time) {
    let result = "";
    result += [time.getMonth() + 1, time.getDate(), time.getFullYear()].join("/");
    result += " ";
    result += [time.getHours(), time.getMinutes(), time.getSeconds()].map(e => e.toString().padStart(2, "0")).join(":");
    return result;
};

const NOTIFICATION_TIMEOUT = 4000;
const loadNotifications = function () {
    launchDuelReadyNotifications();
    
    if(typeof Game !== "undefined" && Game) {
        launchLobbyNotifications();
    }
};

const augmentFunction = function (src, base, accessory, fn, opts) {
    let oldFunction = src[base];
    
    opts = opts || { before: false };
    
    src[base] = function (...args) {
        let [first, second] = opts.before ? [fn, oldFunction] : [oldFunction, fn];
        first(...args);
        second(...args);
    };
    
    if(src[accessory]) {
        src[accessory] = src[base];
    }
    
    return oldFunction;
};

const notifyMessage = function (message, timeout = NOTIFICATION_TIMEOUT) {
    let notif = new Notification(message);
    setTimeout(notif.close.bind(notif), timeout);
};

const launchLobbyNotifications = function () {
    let playersCopy;
    let myPosition;
    
    augmentFunction(Game, "onRoomPlayerJoined", "RoomPlayerJoined", function (a) {
        console.log(">>> PLAYER JOIN <<<");
        if(a.name !== Game.username) {
            notifyMessage(`Player "${a.name}" joined the lobby.`);
        }
        else if(!myPosition) {
            myPosition = a;
            console.log("MYPOS", myPosition);
        }
    }, {
        before: false,
    });
    
    augmentFunction(Game, "onRoomPlayerLeft", "RoomPlayerLeft", function (a) {
        let oldPlayer = Game.players[a.position];
        if(!oldPlayer) {
            // console.log("shit");
            return;
        }
        // console.log(">>> PLAYER LEFT <<<");
        let kind = a.toObserver ? "moved to spectator" : "left the lobby";
        
        // console.log("LEFT", a, oldPlayer, playersCopy);
        
        console.log(a.toObserver);
        if(!a.toObserver || oldPlayer.name !== Game.username) {
            notifyMessage(`Player "${oldPlayer.name}" ${kind}.`);
        }
    }, {
        before: true,
    });
};

let duelAreaStatus;
const launchDuelReadyNotifications = function () {
    // might break easily
    const duelAreaReadyElement = "#duel-area button.bigger-button";
    
    waitForElement(duelAreaReadyElement).then(function (button) {
        console.info("Match found! " + formatTime(new Date()));
        
        if(!duelAreaStatus) {
            duelAreaStatus = $("<div id=duel-area-status>");
            $("#duel-area").append(duelAreaStatus);
        }
        duelAreaStatus.text(formatTime(new Date()));
        
        let notif = new Notification("Your match is ready!");
        let closeNotif = notif.close.bind(notif);
        button.addEventListener("click", closeNotif);
        // may be necessary to remove that listener
        waitForNoElement(duelAreaReadyElement).then(function () {
            closeNotif();
            launchDuelReadyNotifications();
            console.log("Removing!");
            duelAreaStatus.text("");
        });
    });
};

(function () {
    if(!("Notification" in window)) {
        // browser does not support notifications
        console.info("Notifications could not be enabled, please update your browser or try a different one.");
        return;
    }
    
    let success = false;
    Notification.requestPermission().then(function (permission) {
        if(permission === "granted") {
            loadNotifications();
            success = true;
        }
    }).finally(function () {
        console.info(`Nexus notifications ${success ? "started" : "denied"} succesfully.`);
    });
})();