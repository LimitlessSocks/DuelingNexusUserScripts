// ==UserScript==
// @name         DuelingNexus Level Replacement Script
// @namespace    https://duelingnexus.com/
// @version      0.1
// @description  Replaces the stars on cards in the textboxes with a more readable description.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/game/* 
// @include      https://duelingnexus.com/editor/* 
// ==/UserScript==

(function() {
    'use strict';
    // const BASE_URL = "https://duelingnexus.com/game";

    // const isGamePage = function () {
        // let currentURL = window.location.toString();
        // return currentURL.startsWith(BASE_URL);
    // }
    
    // polyfills
    if(!console.error) {
        console.error = function (text) { console.log("Error: ", text); }
    }
    if(!console.info) {
        console.info = function (text) { console.log("Info: ", text); }
    }

    // if(!isGamePage()) {
        // // don't run this script on pages not matching the base
        // console.info("DuelingNexus Level Replacement Script not started.");
        // return;
    // }

    const TYPE_JOINER = "|";
    const LINK_TYPE = "Link";
    const XYZ_TYPE = "Xyz";
    const REFRESH_RATE = 100; // time in ms

    const contains = function (container, el) {
        return container.indexOf(el) !== -1;
    }

    const clearChildren = function (el) {
        while(el.firstChild) {
            el.removeChild(el.firstChild);
        }
        return true;
    }

    const appendTextNode = function (el, text) {
        let textNode = document.createTextNode(text);
        el.appendChild(textNode);
        return true;
    }

    const STAR_REGEX = /^★+$/;

    const updateCardLevel = function () {
        let span = document.getElementById("card-level");
        if(!span) return;
        let cardTypes = document.querySelector("#card-if-monster .card-types");
        if(!cardTypes) return;
        let attributes = cardTypes.textContent.split(TYPE_JOINER);
        let stars = span.textContent;

        // check if we've already done the replacement
        if(!STAR_REGEX.test(stars)) {
            return;
        }

        let levelIndicator = stars.length; // length in characters

        let replacement = null;
        if(contains(attributes, LINK_TYPE)) {
            // this condition should theoretically never activate, but just in case
            // do nothing for link monsters, they're fine already
            return;
        }
        else if(contains(attributes, XYZ_TYPE)) {
            replacement = "Rank " + levelIndicator;
        }
        else {
            replacement = "Level " + levelIndicator;
        }

        if(replacement === null) {
            console.error("No replacement made, this is probably a bug. Please report it to Sock#3222 on discord.");
        }

        clearChildren(span);
        appendTextNode(span, replacement);
    }

    let interval = setInterval(updateCardLevel, REFRESH_RATE);

    console.info("Level replacement script started. Loop number: " + interval);
    console.info("Type   clearInterval(" + interval + ");   to stop the loop.");
})();