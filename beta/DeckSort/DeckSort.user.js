// ==UserScript==
// @name         Dueling Nexus DeckSort Plugin
// @namespace    https://duelingnexus.com/
// @version      0.1
// @description  Adds various support for categorizing decks.
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
// @include      https://duelingnexus.com/login
// @include      https://duelingnexus.com/game/*
// @require      DeckSortHeader.js
// @require      DeckSorter.js
// @require      DeckSelector.js
// ==/UserScript==

// decide which startUp function to run
;
(function () {
    let url = window.location.toString();
    const GAME_URL = "https://duelingnexus.com/game";
    if (url.startsWith(GAME_URL)) {
        startUpDeckSelector();
    }
    else {
        startUpDeckSorter();
    }
})();