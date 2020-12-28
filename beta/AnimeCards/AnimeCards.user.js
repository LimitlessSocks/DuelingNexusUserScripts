// ==UserScript==
// @name         Dueling Nexus Anime Cards Extension
// @namespace    https://duelingnexus.com/
// @description  Reskins the existing Dueling Nexus cards with Anime versions.
// @author       Sock#3222
// @version      0.2
// @match        https://duelingnexus.com/game/*
// @match        https://duelingnexus.com/editor/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/LimitlessSocks/DuelingNexusUserScripts/master/beta/AnimeCards/AnimeCards.user.js
// @downloadURL  https://raw.githubusercontent.com/LimitlessSocks/DuelingNexusUserScripts/master/beta/AnimeCards/AnimeCards.user.js
// ==/UserScript==

(function() {
    window.usingAnimeCards = true;

    //https://cdn.jsdelivr.net/gh/ElvinaOlacarynWorld/OlacarynWorld@d079300/18743376.jpg
    // const githubRepository = "UnendingLegacy";
    const githubRepository = "DictionaryPie";
    const animeBase = "https://raw.githubusercontent.com/LimitlessSocks/" + githubRepository + "/master/small/";
    const getAnimeAsset = (id) => animeBase + id + ".jpg";

    let oldGetPicture = Engine.getCardPicturePath;
    Engine.getCardPicturePath = function (id, usingAnime = window.usingAnimeCards) {
        if(usingAnime && id !== 0) {
            return getAnimeAsset(id);
        }
        else {
            return oldGetPicture(id);
        }
    }

    let oldSetCardImage = Engine.setCardImageElement;

    Engine.setCardImageElement = function (a, b, useAnime = window.usingAnimeCards) {
        a.off("error");
        a.attr("src", Engine.getCardPicturePath(b, useAnime));
        if (0 < b) a.one("error", function() {
            if(useAnime) {
                Engine.setCardImageElement(a, b, false);
            }
            else {
                $(this).attr("src", Engine.getCardPicturePath(-1));
            }
        })
    };
})();
