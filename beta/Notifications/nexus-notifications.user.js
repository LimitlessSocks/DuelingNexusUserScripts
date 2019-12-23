// ==UserScript==
// @name         Dueling Nexus Notification System
// @namespace    https://duelingnexus.com/
// @version      0.1
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
// ==/UserScript==

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

const loadNotifications = function () {
    // might break easily
    const duelAreaReadyElement = "#duel-area button.bigger-button";
    
    waitForElement(duelAreaReadyElement).then(function (button) {
        console.info("Match found!");
        let notif = new Notification("Your match is ready!");
        let closeNotif = notif.close.bind(notif);
        button.addEventListener("click", closeNotif);
        // may be necessary to remove that listener
        waitForNoElement(duelAreaReadyElement).then(function () {
            closeNotif();
            loadNotifications();
        });
    });
};

console.info = console.info || console.log;

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