// ==UserScript==
// @name         DuelingNexus Modern Level Replacement Script
// @namespace    https://duelingnexus.com/
// @version      1.2
// @description  Replaces the stars on cards in the textboxes with a more readable description.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/game/*
// @include      https://duelingnexus.com/editor/*
// @updateURL    https://raw.githubusercontent.com/LimitlessSocks/DuelingNexusUserScripts/master/final/LevelReplacement/LevelReplacement.user.js
// @downloadURL  https://raw.githubusercontent.com/LimitlessSocks/DuelingNexusUserScripts/master/final/LevelReplacement/LevelReplacement.user.js
// ==/UserScript==

let onStart = function () {
    console.log("Level Replacement Script started");
    Engine.UI.prototype.setCardInfo = function(a) {
        if (!(0 >= a) && this.currentCardId !== a && (this.currentCardId = a, a = Engine.getCardData(a))) {
            $("#card-name").text(a.name);
            $("#card-description").html(Engine.textToHtml(a.description));
            $("#card-id").text(a.alias ? a.id + " [" + a.alias + "]" : a.id);
            Engine.setCardImageElement($("#card-picture"), a.id);
            var b = [];
            for (d in CardType) {
                var c = CardType[d];
                a.type & c && b.push(I18n.types[c])
            }
            $(".card-types").text(b.join("|"));
            if (a.type & CardType.MONSTER)
                if ($("#card-if-monster").show(), $("#card-if-spell").hide(),
                    $("#card-race").text(I18n.races[a.race]), $("#card-attribute").text(I18n.attributes[a.attribute]), $("#card-atk").text(a.attack === -2 ? "?" : a.attack), a.type & CardType.LINK) {
                    $("#card-def").text("LINK-" + a.level);
                    var d = "";
                    a.defence & LinkMarker.TOP_LEFT && (d += "&#8598;");
                    a.defence & LinkMarker.TOP && (d += "&#8593;");
                    a.defence & LinkMarker.TOP_RIGHT && (d += "&#8599;");
                    a.defence & LinkMarker.LEFT && (d += "&#8592;");
                    a.defence & LinkMarker.RIGHT && (d += "&#8594;");
                    a.defence & LinkMarker.BOTTOM_LEFT && (d += "&#8601;");
                    a.defence & LinkMarker.BOTTOM && (d += "&#8595;");
                    a.defence & LinkMarker.BOTTOM_RIGHT && (d += "&#8600;");
                    $("#card-level").html(d)
                } else {
                    $("#card-def").text(a.defence === -2 ? "?" : a.defence);
                    d = "";
                    let levelIndicator = "Level";
                    if(a.type & CardType.XYZ) {
                        levelIndicator = "Rank";
                    }
                    d = levelIndicator + " " + a.level.toString();
                    $("#card-level").html(d)
                }
            else $("#card-if-monster").hide(), $("#card-if-spell").show()
        }
    };
};

let checkStartUp = function () {
    if(Engine.UI) {
        onStart();
        // destroy reference; pseudo-closure
        onStart = null;
    }
    else {
        setTimeout(checkStartUp, 100);
    }
}
checkStartUp();