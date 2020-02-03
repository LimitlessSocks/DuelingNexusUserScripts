// ==UserScript==
// @name         DuelingNexus Deck Editor Revamp
// @namespace    https://duelingnexus.com/
// @version      0.13.11
// @description  Revamps the deck editor search feature.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/editor/*
// @updateURL   https://raw.githubusercontent.com/LimitlessSocks/DuelingNexusUserScripts/master/beta/RefinedSearch/RefinedSearch.user.js
// @downloadURL https://raw.githubusercontent.com/LimitlessSocks/DuelingNexusUserScripts/master/beta/RefinedSearch/RefinedSearch.user.js
// ==/UserScript==

// TODO: rehash sort function
try{
const EXT = {
    RESULTS_PER_PAGE: 30,
    MIN_INPUT_LENGTH: 1,
    SEARCH_BY_TEXT: true,
    MAX_UNDO_RECORD: 30,
    DECK_SIZE_LIMIT: null,
    BANLIST_NAME: null,
    Search: {
        cache: [],
        current_page: 1,
        max_page: null,
        per_page: null,
        messages: [],
    },
    // contents defined later
    EDIT_API: {}
};
window.EXT = EXT;
const FN = {
    compose: function (f, g) {
        return function (...inputs) {
            return f(g(...inputs));
        }
    },
    hook: function (f, h, g) {
        return function (...inputs) {
            let fv = f(...inputs);
            let gv = g(...inputs);
            return h(fv, gv);
        }
    },
    not: function (x) {
        return !x;
    },
    or: function (x, y) {
        return x || y;
    },
    and: function (x, y) {
        return x && y;
    },
    add: function (x, y) {
        return x + y;
    },
    fold: function (f, xs, seed = 0) {
        return xs.reduce(f, seed);
    },
    sum: function (xs) {
        return FN.fold(FN.add, xs);
    },
    // I heard you like obfuscation
    xor: function (x, y) {
        return x ? y ? 0 : 1 : y;
    },
};
window.FN = FN;

const TokenTypes = {
    OPERATOR: Symbol("TokenTypes.OPERATOR"),
    OPEN_PAREN: Symbol("TokenTypes.OPEN_PAREN"),
    CLOSE_PAREN: Symbol("TokenTypes.CLOSE_PAREN"),
    WHITESPACE: Symbol("TokenTypes.WHITESPACE"),
    EXPRESSION: Symbol("TokenTypes.EXPRESSION"),
    UNKNOWN: Symbol("TokenTypes.UNKNOWN"),
};
class SearchInputToken {
    constructor(raw, type, position) {
        this.raw = raw;
        this.type = type;
        this.position = position;
    }
    
    isWhiteSpace() {
        return this.type === TokenTypes.WHITESPACE;
    }
    
    isData() {
        return this.type === TokenTypes.EXPRESSION;
    }
    
    isOperator() {
        return this.type === TokenTypes.OPERATOR;
    }
    
    isOpenParenthesis() {
        return this.type === TokenTypes.OPEN_PAREN;
    }
    
    isCloseParenthesis() {
        return this.type === TokenTypes.CLOSE_PAREN;
    }
    
    toString() {
        // let repr = "Token[ ";
        // repr += this.position.toString().padStart(2);
        // repr += ":";
        // repr += this.type.toString().padEnd(32);
        // repr += JSON.stringify(this.raw);
        // repr += " ]";
        
        // return repr;
        
        return "SearchInputToken(" + JSON.stringify(this.raw) + ", " + this.type.toString() + ", " + this.position + ")";
    }
    
    inspect() {
        return this.toString();
    }
}
class SearchInputParser {
    constructor(input) {
        this.input = input;
        this.tokens = [];
        this.index = 0;
    }
    
    get running() {
        return this.index < this.input.length;
    }
    
    step() {
        let slice = this.input.slice(this.index);
        for(let [regex, type] of SearchInputParser.RULES) {
            let match = slice.match(regex);
            if(match && match.length) {
                match = match[0];
                if(type === TokenTypes.UNKNOWN) {
                    throw new Error("Unknown token(" + this.index + "): \"" + match + '"');
                }
                this.tokens.push(new SearchInputToken(match, type, this.index));
                this.index += match.length;
                break;
            }
        }
    }
    
    parse() {
        while(this.running) {
            this.step();
        }
    }
    
    static parse(text) {
        let inst = new SearchInputParser(text);
        inst.parse();
        return inst.tokens;
    }
    
    static parseSignificant(text) {
        return SearchInputParser.parse(text).filter(token => !token.isWhiteSpace());
    }
}
SearchInputParser.RULE_EXPRESSION = /^((?:[&=]|[!><]=?)\s*)?("(?:[^"]|"")*"|\S+?(?:\s|$))/;
SearchInputParser.RULES = [
    [/^\s+/, TokenTypes.WHITESPACE],
    [/^\(/, TokenTypes.OPEN_PAREN],
    [/^\)/, TokenTypes.CLOSE_PAREN],
    [/^\b(?:OR|AND)\b|,/, TokenTypes.OPERATOR],
    [SearchInputParser.RULE_EXPRESSION, TokenTypes.EXPRESSION],
    [/^./, TokenTypes.UNKNOWN],
];

// higher = tighter
const OPERATOR_PRECEDENCE = {
    "AND":  100,
    "OR":   50,
};

class SearchInputShunter {
    constructor(input) {
        this.tokens = SearchInputParser.parseSignificant(input);
        this.index = 0;
        this.operatorStack = [];
        this.outputQueue = [];
    }

    static parseValue(raw) {
        let wholeMatch = raw.match(SearchInputParser.RULE_EXPRESSION);
        if(wholeMatch !== null) {
            let [ match, comp, value ] = wholeMatch;
            // default to = for comparison
            raw = (comp || "=") + value;
        }
        
        raw = raw.replace(/"((?:[^"]|"")*)"/g, function (match, inner) {
            // undouble escapes
            return inner.replace(/""/g, '"');
        });
        
        return raw;
    }
    
    get operatorStackTop() {
        return this.operatorStack[this.operatorStack.length - 1];
    }
    
    get running() {
        return this.index < this.tokens.length;
    }
    
    parseToken(token) {
        if(token.isData()) {
            // idc if this is impure shunting procedures, it works!
            let modifiedToken = new SearchInputToken(SearchInputShunter.parseValue(token.raw), token.type, token.position);
            this.outputQueue.push(modifiedToken);
        }
        else if(token.isOpenParenthesis()) {
            this.operatorStack.push(token);
        }
        else if(token.isCloseParenthesis()) {
            while(this.operatorStackTop && !this.operatorStackTop.isOpenParenthesis()) {
                this.outputQueue.push(this.operatorStack.pop());
            }
            if(this.operatorStackTop && this.operatorStackTop.isOpenParenthesis()) {
                this.operatorStack.pop();
            }
            else {
                throw new Error("Unbalanced parentheses");
            }
        }
        else if(token.isOperator()) {
            let currentPrecedence = OPERATOR_PRECEDENCE[token.raw];
            while(this.operatorStackTop && OPERATOR_PRECEDENCE[this.operatorStackTop.raw] > currentPrecedence) {
                this.outputQueue.push(this.operatorStack.pop());
            }
            this.operatorStack.push(token);
        }
    }
    
    shunt() {
        for(let token of this.tokens) {
            this.parseToken(token);
        }
        while(this.operatorStackTop) {
            this.outputQueue.push(this.operatorStack.pop());
        }
    }
    
    static parseSections(text) {
        let shunter = new SearchInputShunter(text);
        shunter.shunt();
        return shunter.outputQueue;
    }
}

let onStart = function () {
    // check if NexusGUI extension is installed
    const NEXUS_GUI_EXTENSION_INSTALLATION = "https://github.com/LimitlessSocks/DuelingNexusUserScripts/raw/master/beta/CustomNexusGUI/CustomNexusGUI.user.js";
    
    if(typeof NexusGUI === "undefined") {
        alert("Error - You need to install the Custom GUI Extension, found here: " + NEXUS_GUI_EXTENSION_INSTALLATION);
        return;
    }
    
    const ADVANCED_SETTINGS_HTML_STRING = `
        <div id=rs-ext-advanced-search-bar>
          <button id=rs-ext-monster-toggle class="engine-button engine-button-default">monster</button><button id=rs-ext-spell-toggle class="engine-button engine-button-default">spell</button><button id=rs-ext-trap-toggle class="engine-button engine-button-default">trap</button>
          <button id=rs-ext-sort-toggle class="engine-button engine-button-default rs-ext-right-float">sort</button>
          <button id=rs-ext-clear-filter class="engine-button engine-button-default engine-button-danger rs-ext-right-float">clear filter</button>
          <div id=rs-ext-advanced-pop-outs>
            <div id=rs-ext-sort class="rs-ext-shrinkable rs-ext-shrunk">
              <table id=rs-ext-sort-table class=rs-ext-table>
                <tr>
                  <th>Sort By</th>
                  <td>
                    <select class=rs-ext-input id=rs-ext-sort-by>
                      <option>Name</option>
                      <option>Level</option>
                      <option>ATK</option>
                      <option>DEF</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Sort Order</th>
                  <td>
                    <select class=rs-ext-input id=rs-ext-sort-order>
                      <option>Ascending</option>
                      <option>Descending</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Stratify?</th>
                  <td><input type=checkbox id=rs-ext-sort-stratify checked></td>
                </tr>
              </table>
            </div>
            <div id=rs-ext-spell class="rs-ext-shrinkable rs-ext-shrunk">
              <table>
                <tr>
                  <th>Spell Card Type</th>
                  <td>
                    <select id=rs-ext-spell-type>
                      <option></option>
                      <option>Normal</option>
                      <option>Quick-play</option>
                      <option>Field</option>
                      <option>Continuous</option>
                      <option>Ritual</option>
                      <option>Equip</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Limit</th>
                  <td><input class=rs-ext-input id=rs-ext-spell-limit></td>
                </tr>
              </table>
            </div>
            <div id=rs-ext-trap class="rs-ext-shrinkable rs-ext-shrunk">
              <table>
                <tr>
                  <th>Trap Card Type</th>
                  <td>
                    <select id=rs-ext-trap-type>
                      <option></option>
                      <option>Normal</option>
                      <option>Continuous</option>
                      <option>Counter</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Limit</th>
                  <td><input class=rs-ext-input id=rs-ext-trap-limit></td>
                </tr>
              </table>
            </div>
            <div id=rs-ext-monster class="rs-ext-shrinkable rs-ext-shrunk">
              <table class="rs-ext-left-float rs-ext-table"id=rs-ext-link-arrows>
                <tr>
                  <th colspan=3>Link Arrows</th>
                </tr>
                <tr>
                  <td><button class=rs-ext-toggle-button>↖</button></td>
                  <td><button class=rs-ext-toggle-button>↑</button></td>
                  <td><button class=rs-ext-toggle-button>↗</button></td>
                </tr>
                <tr>
                  <td><button class=rs-ext-toggle-button>←</button></td>
                  <td><button class=rs-ext-toggle-button id=rs-ext-equals>=</button></td>
                  <td><button class=rs-ext-toggle-button>→</button></td>
                </tr>
                <tr>
                  <td><button class=rs-ext-toggle-button>↙</button></td>
                  <td><button class=rs-ext-toggle-button>↓</button></td>
                  <td><button class=rs-ext-toggle-button>↘</button></td>
                </tr>
              </table>
              <div id=rs-ext-monster-table class="rs-ext-left-float rs-ext-table">
                <table>
                  <tr>
                    <th>Category</th>
                    <td>
                      <select class=rs-ext-input id=rs-ext-monster-category>
                        <option></option>
                        <option>Normal</option>
                        <option>Effect</option>
                        <option>Ritual</option>
                        <option>Fusion</option>
                        <option>Synchro</option>
                        <option>Xyz</option>
                        <option>Pendulum</option>
                        <option>Link</option>
                        <option>Leveled</option>
                        <option>Extra Deck</option>
                        <option>Non-Effect</option>
                        <option>Gemini</option>
                        <option>Flip</option>
                        <option>Spirit</option>
                        <option>Toon</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Ability</th>
                    <td>
                      <select id=rs-ext-monster-ability class=rs-exit-input>
                        <option></option>
                        <option>Tuner</option>
                        <option>Toon</option>
                        <option>Spirit</option>
                        <option>Union</option>
                        <option>Gemini</option>
                        <option>Flip</option>
                        <option>Pendulum</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Type</th>
                    <td>
                      <select id=rs-ext-monster-type class=rs-ext-input>
                        <option></option>
                        <option>Aqua</option>
                        <option>Beast</option>
                        <option>Beast-Warrior</option>
                        <option>Cyberse</option>
                        <option>Dinosaur</option>
                        <option>Dragon</option>
                        <option>Fairy</option>
                        <option>Fiend</option>
                        <option>Fish</option>
                        <option>Insect</option>
                        <option>Machine</option>
                        <option>Plant</option>
                        <option>Psychic</option>
                        <option>Pyro</option>
                        <option>Reptile</option>
                        <option>Rock</option>
                        <option>Sea Serpent</option>
                        <option>Spellcaster</option>
                        <option>Thunder</option>
                        <option>Warrior</option>
                        <option>Winged Beast</option>
                        <option>Wyrm</option>
                        <option>Zombie</option>
                        <option>Creator God</option>
                        <option>Divine-Beast</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Attribute</th>
                    <td>
                      <select id=rs-ext-monster-attribute class=rs-ext-input>
                        <option></option>
                        <option>DARK</option>
                        <option>EARTH</option>
                        <option>FIRE</option>
                        <option>LIGHT</option>
                        <option>WATER</option>
                        <option>WIND</option>
                        <option>DIVINE</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>Limit</th>
                    <td><input class=rs-ext-input id=rs-ext-monster-limit></td>
                  </tr>
                  <tr>
                    <th>Level/Rank/Link Rating</th>
                    <td><input class=rs-ext-input id=rs-ext-level></td>
                  </tr>
                  <tr>
                    <th>Pendulum Scale</th>
                    <td><input class=rs-ext-input id=rs-ext-scale></td>
                  </tr>
                  <tr>
                    <th>ATK</th>
                    <td><input class=rs-ext-input id=rs-ext-atk></td>
                  </tr>
                  <tr>
                    <th>DEF</th>
                    <td><input class=rs-ext-input id=rs-ext-def></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div id=rs-ext-spacer></div>
        </div>
    `;
    
    const ADVANCED_SETTINGS_HTML_ELS = jQuery.parseHTML(ADVANCED_SETTINGS_HTML_STRING);
    ADVANCED_SETTINGS_HTML_ELS.reverse();
    
    // local CSS styles
    const ADVANCED_SETTINGS_CSS_STRING = `
        #rs-ext-advanced-search-bar {
            width: 100%
        }

        .rs-ext-toggle-button {
            width: 3em;
            height: 3em;
            background: #ddd;
            border: 1px solid #000
        }

        .rs-ext-toggle-button:hover {
            background: #fff
        }

        button.rs-ext-selected {
            background: #00008b;
            color: #fff
        }

        button.rs-ext-selected:hover {
            background: #55d
        }

        .rs-ext-left-float {
            float: left
        }

        .rs-ext-right-float {
            float: right
        }

        .rs-ext-shrinkable {
            transition-property: transform;
            transition-duration: .3s;
            transition-timing-function: ease-out;
            height: auto;
            background: #ccc;
            width: 100%;
            transform: scaleY(1);
            transform-origin: top;
            overflow: hidden;
            z-index: 10000
        }

        .rs-ext-shrinkable > * {
            margin: 10px
        }

        #rs-ext-monster,
        #rs-ext-spell,
        #rs-ext-trap,
        #rs-ext-sort {
            background: rgba(0, 0, 0, .7)
        }

        .rs-ext-shrunk {
            transform: scaleY(0);
            z-index: 100
        }

        #rs-ext-advanced-pop-outs {
            position: relative
        }

        #rs-ext-advanced-pop-outs>.rs-ext-shrinkable {
            position: absolute;
            top: 0;
            left: 0
        }

        #rs-ext-monster-table th,
        #rs-ext-sort-table th {
            text-align: right
        }

        .rs-ext-table {
            padding-right: 5px
        }

        #rs-ext-spacer {
            height: 0;
            transition: height .3s ease-out
        }

        #rs-ext-sort {
            transition-property: top, transform
        }

        .engine-button[disabled],
        .engine-button:disabled {
            cursor: not-allowed;
            background: rgb(50, 0, 0);
            color: #a0a0a0;
            font-style: italic;
        }

        .rs-ext-card-entry-table button,
        .rs-ext-fullwidth-wrapper {
            width: 100%;
            height: 100%;
        }

        .rs-ext-card-entry-table {
            border-collapse: collapse;
        }

        .rs-ext-card-entry-table tr,
        .rs-ext-card-entry-table td {
            height: 100%;
        }

        .editor-search-description {
            white-space: normal;
        }

        #editor-menu-spacer {
            width: 15%;
        }

        .engine-button {
            cursor: pointer;
        }

        @media (min-width:1600px) {
            .editor-search-result {
                font-size: 1em
            }
            .editor-search-card {
                width: 12.5%
            }
            .editor-search-banlist-icon {
                width: 5%
            }
            .editor-search-result {
                width: 100%
            }
        }

        .rs-ext-table-button {
            padding: 8px;
            text-align: center;
            border: 1px solid #AAAAAA;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .rs-ext-table-button:active {
            padding: 8px 7px 8px 9px;
        }

        .rs-ext-flex {
            display: flex;
            width: 100%;
            justify-content: space-between
        }

        .rs-ext-flex input {
            width: 48%;
        }

        input::placeholder {
            font-style: italic;
            text-align: center;
        }
        
        #rs-ext-banlist {
            margin: 5px;
        }
        
        #rs-ext-advanced-search-bar > button {
            margin: 2px;
        }
        
        #rs-ext-navigation {
            
        }
        
        #rs-ext-navigate-left,
        #rs-ext-navigate-right {
            margin: 5px;
        }
        
        #rs-ext-spacer-left,
        #rs-ext-spacer-right {
            width: 25%;
        }
        #rs-ext-button-holder {
            width: 50%;
            text-align: center;
        }
        #rs-ext-spacer-right {
            text-align: right;
        }
        #rs-ext-navigation {
            width: 100%;
        }
    `;
    
    // extend jQuery
    jQuery.fn.tagName = function () {
        return this.prop("tagName").toUpperCase();
    };
    jQuery.fn.tagEquals = function (name) {
        return this.tagName() === name.toUpperCase();
    }
    
    // disable default listener (Z.Rb)
    $("#editor-search-text").off("input");
    
    // VOLATILE FUNCTIONS, MAY CHANGE AFTER A MAIN UPDATE
    const computePadding = Z.Ca;
    const updateBanlistIcons = Z.N;
    const countInDecks = Z.Gb;
    const removeCardSilent = Z.P;
    const defaultShuffleList = Z.Pb;
    const previewCardSelection = Z.Aa;
    const getCardTemplate = () => $(Z.Nb);
    const searchResults = () => $(Z.za);
    
    const CARD_LIST = X;
    
    // expected result: { zb: "Warrior", qb: "Spellcaster", ... }
    const TYPE_HASH = bg;
    const TYPE_LIST = Object.values(TYPE_HASH);
    
    // expected result: { Ta: 1, Ab: 2, Za: 4, Bb: 8, cb: 16, Na: 32, Pa: 64 }
    const ATTRIBUTE_MASK_HASH = Yf;
    // expected result: { Ta: "EARTH", Ab: "WATER", ... }
    const ATTRIBUTE_WORD_VALUE_HASH = ag;
    
    const ATTRIBUTE_HASH = {};
    for(obfs in ATTRIBUTE_MASK_HASH) {
        let attr = ATTRIBUTE_WORD_VALUE_HASH[obfs].toUpperCase();
        ATTRIBUTE_HASH[attr] = ATTRIBUTE_MASK_HASH[obfs];
    };
    
    const attributeOf = function (cardObject) {
        return cardObject.H;
    };
    
    const scalesOf = function (cardObject) {
        return [cardObject.xa, cardObject.ya];
    }
    
    const makeSearchable = function (name) {
        return name//.replace(/ /g, "")
                   .toUpperCase();
    }
    
    const searchableCardName = function (id_or_card) {
        let card;
        if(typeof id_or_card === "number") {
            card = CARD_LIST[id_or_card];
        }
        else {
            card = id_or_card;
        }
        let searchable = makeSearchable(card.name);
        // cache name
        if(!card.searchName) {
            card.searchName = searchable;
        }
        return searchable;
    }
    
    // expected result for Ef: { 0: "?", 1: "Warrior", 2: "Spellcaster", ... }
    const monsterType = function (card) {
        return Ef[card.race];
    }
    const monsterTypeMap = {};
    // expected result for Wf: { 0: "?", 1: "Monster", 2: "Spell", ... }
    for(let key in Wf) {
        let value = Wf[key];
        monsterTypeMap[value] = parseInt(key, 10);
    }
    window.monsterTypeMap = monsterTypeMap;
    
    // expected result for ha.b: { {...}, ...}
    const banlists = ha.b;
    const banlistNames = banlists.map(list => list.name);
    EXT.BANLIST_NAME = banlistNames[0];
    const allowedCount = function (card, index = EXT.BANLIST_NAME) {
        // card.A = the source id (e.g. for alt arts)
        // card.id = the actual id
        let ident = card.A || card.id || card;
        
        if(typeof index === "string") {
            index = banlistNames.indexOf(index);
            if(index < 0) {
                index = 0;
            }
        }
        
        let banlist = banlists[index];
        
        if(!banlist) {
            console.warn("Banlist unable to be loaded (" + index + ")");
            return 3;
        }
        
        if(banlist.bannedIds.indexOf(ident) !== -1) {
            return 0;
        }
        
        if(banlist.limitedIds.indexOf(ident) !== -1) {
            return 1;
        }
        
        if(banlist.semiLimitedIds.indexOf(ident) !== -1) {
            return 2;
        }
        
        return 3;
    }
    const clearVisualSearchOptions = function () {
        return Z.Fb();
    }
    const isPlayableCard = function (card) {
        // internally checks U.U - having that bit means its not a playable card
        // (reserved for tokens, it seems)
        return Z.ua(card);
    }
    const sanitizeText = function (text) {
        // qa - converts to uppercase and removes:
        //      newlines, hyphens, spaces, colons, and periods
        return qa(text);
    }
    const cardCompare = function (cardA, cardB) {
        return Z.fa(cardA, cardB);
    }
    const shuffle = function (list) {
        return Z.Nb(list);
    }
    // clears the visual state, allowing editing to take place
    const clearVisualState = function () {
        Z.pa();
    }
    // restores the visual state
    const restoreVisualState = function () {
        Z.ma();
    }
    const lastElement = function (arr) {
        return arr[arr.length - 1];
    }
    // modified from https://stackoverflow.com/a/6969486/4119004
    const escapeRegex = function (string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    const previewCard = Cc;
    
    const engineButton = function (content, id = null) {
        let button = makeElement("button", id, content);
        button.prop("classList").add("engine-button", "engine-button-default");
        return button;
    }
    
    // Z.Da = function() {
        // if(Z.selection) {
            // console.log("tick");
            // Z.selection.css("left", Z.Ib + 3).css("top", Z.Jb + 3);
        // }
    // };
    // reimplements Z.la
    const banlistIcons = {
        3: null,
        2: "banlist-semilimited.png",
        1: "banlist-limited.png",
        0: "banlist-banned.png",
    };
    const addCardToSearchWithButtons = function (cardId) {
        let card = CARD_LIST[cardId];
        let template = getCardTemplate();
        template.find(".template-name").text(card.name);
        l(template.find(".template-picture"), card.id);
        if (card.type & U.L) {
            template.find(".template-if-spell").remove();
            template.find(".template-level").text(card.level);
            template.find(".template-atk").text(card.attack);
            template.find(".template-def").text(card.i);
            // Df - object indexed by powers of 2 containg *type* information
            // card.race = type
            template.find(".template-race").text(Ef[card.race]);
            // Ef - object indexed by powers of 2 containing *attribute* information
            // card.H = attribute
            template.find(".template-attribute").text(Ff[card.H]);
        }
        else {
            template.find(".template-if-monster").remove();
            var types = [];
            for (let n of Object.values(U)) {
                if(card.type & n) {
                    types.push(Wf[n]);
                }
            }
            template.find(".template-types").text(types.join("|"));
        }
        template.data("id", card.id);
        template.mouseover(function () {
            previewCard($(this).data("id"));
        });
        template.mousedown(function (a) {
            // left mouse - move card to tooltip
            if (1 == a.which) {
                let id = $(this).data("id");
                previewCardSelection(id);
                return false;
            }
            // right mouse - do nothing (allow contextmenu to trigger)
            if (3 == a.which) {
                return false;
            }
        });
        let addThisCard = function (el, destination = null) {
            let id = $(el).data("id");
            let card = CARD_LIST[id];
            // deduce destination
            if(!destination) {
                destination = "main";
                if (card.type & U.S || card.type & U.T || card.type & U.G || card.type & U.C) {
                    destination = "extra";
                }
            }
            addCard(id, destination, -1);
            return false;
        }
        template.on("contextmenu", function () {
            return addThisCard(this);
        });
        /* BANLIST TOKEN GENERATION */
        var banlistIcon = template.find(".editor-search-banlist-icon");
        let limitStatus = allowedCount(card);
        if(limitStatus !== 3) {
            banlistIcon.attr("src", "assets/images/" + banlistIcons[limitStatus]);
        }
        else {
            banlistIcon.remove();
        }
        let container = $("<table width=100% class=rs-ext-card-entry-table>");
        let cardTd = $("<td width=74% class=card-preview></td>");
        let mainTd = $("<td width=13% class=rs-ext-table-button class>Add to Main</td>");
        let sideTd = $("<td width=13% class=rs-ext-table-button>Add to Side</td>");
        
        cardTd.append(...template);
        
        mainTd.click(() => addThisCard(template));
        
        sideTd.click(() => addThisCard(template, "side"));
        
        container.append($("<tr>").append(cardTd, mainTd, sideTd));
        searchResults().append(container);
    }
    
    const addCardToSearch = function (card) {
        // return Z.la(card);
        return addCardToSearchWithButtons(card);
    }
    
    // interaction stuff
    const pluralize = function (noun, count, suffix = "s", base = "") {
        return noun + (count == 1 ? base : suffix);
    }
    
    // card identification stuff
    const isToken               = (card) => card.type & monsterTypeMap["Token"];
    
    const isTrapCard            = (card) => card.type & monsterTypeMap["Trap"];
    const isSpellCard           = (card) => card.type & monsterTypeMap["Spell"];
    const isRitualSpell         = (card) => isSpellCard(card) && (card.type & monsterTypeMap["Ritual"]);
    const isContinuous          = (card) => card.type & monsterTypeMap["Continuous"];
    const isCounter             = (card) => card.type & monsterTypeMap["Counter"];
    const isField               = (card) => card.type & monsterTypeMap["Field"];
    const isEquip               = (card) => card.type & monsterTypeMap["Equip"];
    const isQuickPlay           = (card) => card.type & monsterTypeMap["Quick-Play"];
    const isSpellOrTrap         = (card) => isSpellCard(card) || isTrapCard(card);
    
    const nonNormalSpellTraps   = [isContinuous, isQuickPlay, isField, isCounter, isEquip, isRitualSpell];
    const isNormalSpellOrTrap   = (card) =>
        isSpellOrTrap(card)
        && !nonNormalSpellTraps.some(cond => cond(card));
    
    const isNormalMonster       = (card) => card.type & monsterTypeMap["Normal"];
    const isEffectMonster       = (card) => card.type & monsterTypeMap["Effect"];
    const isMonster             = (card) => !isTrapCard(card) && !isSpellCard(card);
    const isNonEffectMonster    = (card) => !isEffectMonster(card);
    const isFusionMonster       = (card) => card.type & monsterTypeMap["Fusion"];
    const isRitualMonster       = (card) => isMonster(card) && (card.type & monsterTypeMap["Ritual"]);
    const isSynchroMonster      = (card) => card.type & monsterTypeMap["Synchro"];
    const isTunerMonster        = (card) => card.type & monsterTypeMap["Tuner"];
    const isLinkMonster         = (card) => card.type & monsterTypeMap["Link"];
    const isGeminiMonster       = (card) => card.type & monsterTypeMap["Dual"];
    const isToonMonster         = (card) => card.type & monsterTypeMap["Toon"];
    const isFlipMonster         = (card) => card.type & monsterTypeMap["Flip"];
    const isSpiritMonster       = (card) => card.type & monsterTypeMap["Spirit"];
    const isXyzMonster          = (card) => card.type & monsterTypeMap["Xyz"];
    const isPendulumMonster     = (card) => card.type & monsterTypeMap["Pendulum"];
    
    const isExtraDeckMonster = (card) => [
        isFusionMonster,
        isSynchroMonster,
        isXyzMonster,
        isLinkMonster
    ].some(fn => fn(card));
    
    const isLevelMonster = (card) => isMonster(card) && !isLinkMonster(card) && !isXyzMonster(card);
    
    // non-ritual main deck monster
    const isBasicMainDeckMonster  = (card) => isMonster(card) && !isRitualMonster(card) && !isExtraDeckMonster(card);
    
    let kindMap = {
        "TRAP": isTrapCard,
        "SPELL": isSpellCard,
        "MONSTER": isMonster,
        "CONT": isContinuous,
        "CONTINUOUS": isContinuous,
        "COUNTER": isCounter,
        "FIELD": isField,
        "EQUIP": isEquip,
        "QUICK": isQuickPlay,
        "QUICKPLAY": isQuickPlay,
        "NORMAL": isNormalMonster,
        "NORMALST": isNormalSpellOrTrap,
        "EFFECT": isEffectMonster,
        "NONEFF": isNonEffectMonster,
        "NONEFFECT": isNonEffectMonster,
        "FUSION": isFusionMonster,
        "RITUAL": isRitualMonster,
        "RITUALST": isRitualSpell,
        "TUNER": isTunerMonster,
        "LINK": isLinkMonster,
        "SYNC": isSynchroMonster,
        "SYNCHRO": isSynchroMonster,
        "DUAL": isGeminiMonster,
        "GEMINI": isGeminiMonster,
        "TOON": isToonMonster,
        "FLIP": isFlipMonster,
        "SPIRIT": isSpiritMonster,
        "XYZ": isXyzMonster,
        "PENDULUM": isPendulumMonster,
        "PEND": isPendulumMonster,
        "LEVELED": isLevelMonster,
        "EXTRA": isExtraDeckMonster,
    };
    
    
    const allSatisfies = function (tags, card) {
        return tags.every(tag => tag(card));
    }
    
    const defaultSearchOptionState = function () {
        clearVisualSearchOptions();
    };
    
    const displayResults = function () {
        defaultSearchOptionState();
        if(EXT.Search.cache.length !== 0) {
            replaceTextNode(currentPageIndicator, EXT.Search.current_page);
            let startPosition = (EXT.Search.current_page - 1) * EXT.Search.per_page;
            let endPosition = Math.min(
                EXT.Search.cache.length,
                startPosition + EXT.Search.per_page
            );
            for(let i = startPosition; i < endPosition; i++) {
                addCardToSearch(EXT.Search.cache[i].id);
            }
        }
        infoBox.empty();
        for(let container of EXT.Search.messages) {
            let [kind, message] = container;
            let color, symbol;
            switch(kind) {
                case STATUS.ERROR:
                    color = GUI_COLORS.HEADER.FAILURE;
                    symbol = SYMBOLS.ERROR;
                    break;
                
                case STATUS.SUCCESS:
                    color = GUI_COLORS.HEADER.SUCCESS;
                    symbol = SYMBOLS.SUCCESS;
                    break;
                
                case STATUS.NEUTRAL:
                default:
                    color = GUI_COLORS.HEADER.NEUTRAL;
                    symbol = SYMBOLS.INFO;
                    break;
            }
            let symbolElement = makeElement("span");
            let messageElement = makeElement("span");
            
            appendTextNode(symbolElement, symbol);
            symbolElement.css("padding", "3px");
            appendTextNode(messageElement, message);
            
            let alignTable = makeElement("table");
            alignTable.css("backgroundColor", color);
            alignTable.css("padding", "2px");
            let tr = makeElement("tr");
            tr.append(
                makeElement("td").append(symbolElement),
                makeElement("td").append(messageElement)
            );
            alignTable.append(tr);
            
            infoBox.append(alignTable);
        }
    }
    
    const STATUS = { ERROR: 0, NEUTRAL: -1, SUCCESS: 1 };
    const addMessage = function (kind, message) {
        EXT.Search.messages.push([kind, message]);
    }
    
    const initializeMessageContainer = function () {
        EXT.Search.messages = [];
    }
    // gui/dom manipulation stuff
    const appendTextNode = function (el, text) {
        el.append(text);
        return true;
    }
    const makeElement = function (name, id = null, content = null, opts = {}) {
        let el = document.createElement(name);
        if(id !== null) {
            el.id = id;
        }
        if(content !== null) {
            $(el).append(content);
        }
        for(let [key, val] of Object.entries(opts)) {
            el[key] = val;
        }
        return $(el);
    }
    const HTMLTag = function (tag, id, classes, ...children) {
        let el = makeElement(tag, id);
        if(classes) {
            el.prop("classList").add(...classes);
        }
        for(let child of children) {
            el.append(child);
        }
        return el;
    }
    const replaceTextNode = function (el, newText) {
        el.empty();
        el.append(newText);
    }
    const NO_SELECT_PROPERTIES = [
        "-webkit-touch-callout",
        "-webkit-user-select",
        "-khtml-user-select",
        "-moz-user-select",
        "-ms-user-select",
        "user-select",
    ];
    // TODO: select based on browser?
    const noSelect = function (el) {
        NO_SELECT_PROPERTIES.forEach(property => {
            el.css(property, "none");
        });
    }
    
    const GUI_COLORS = {
        HEADER: {
            NEUTRAL: "rgba(0,   0,   0,   0.7)",
            SUCCESS: "rgba(0,   150, 0,   0.7)",
            FAILURE: "rgba(150, 0,   0,   0.7)"
        }
    };
    const SYMBOLS = {
        SUCCESS: "✔",
        INFO: "🛈",
        ERROR: "⚠",
    };
    
    let styleHeaderNeutral = function (el) {
        el.css("background", GUI_COLORS.HEADER.NEUTRAL)
          .css("font-size", "16px")
          .css("padding", "3px")
          .css("margin-bottom", "10px");
    }
    
    // https://stackoverflow.com/a/30832210/4119004
    const download = function promptSaveFile (data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }
    
    /* TODO: allow larger deck sizes */
    
    /*
    let deckSizes = {
        "main":  [   40,    60,   100],
        "extra": [   10,    15,    25],
        "side":  [   10,    15,    25],
    };
    // if length > corresponding cell in deckSizes, pad by this much
    let cardMargins = {
        "main":  [ -3.6, -4.05, -6.00],
        "extra": [ -3.6, -4.05, -6.00],
        "side":  [ -3.6, -4.05, -6.00],
    };
    Z.Ca = function (a) {
        var padding = "0";
        // let 
        if(Z[a].length > ("main" == a ? 80 : 25)) {
            // padding = "main" == a ? "-4.05%" : "-4.72%";
            padding = "-6.0%";
        }
        else if(Z[a].length > ("main" == a ? 60 : 15)) {
            padding = "main" == a ? "-4.05%" : "-4.72%";
        }
        else if(Z[a].length > ("main" == a ? 40 : 10)) {
            padding = "-3.6%";
        }
        if (Z.ha[a] !== padding) {
            Z.ha[a] = padding;
            for (var c = 0; c < Z[a].length; ++c) Z[a][c].css("margin-right", padding);
        }
    },
    */
    
    /* UNDO / REDO */
    const addCardSilent = function(a, destination, c, d) {
        let card = X[a];
        if (card && !isToken(card)) {
            let toMainDeck = destination === "main";
            let toExtraDeck = destination === "extra";
            let isExtra = isExtraDeckMonster(card);
            let sizeLimit = EXT.DECK_SIZE_LIMIT || toMainDeck ? 60 : 15;
            let isInvalidLocation = (
                   isExtra && toMainDeck
                || !isExtra && toExtraDeck
                || Z[destination].length >= sizeLimit
                // cannot have more than 3 copies!
                || countInDecks(card.A ? card.A : card.id) >= 3
            );
            
            if (!isInvalidLocation) {
                g = Z[destination];
                var k = $("#editor-" + destination + "-deck");
                d = $("<img>").css("margin-right", Z.ha[destination]).addClass("editor-card-small");
                l(d, a);
                d.mouseover(function() {
                    previewCard($(this).data("id"));
                });
                d.mousedown(function(a) {
                    if (1 == a.which) {
                        a = $(this).data("id");
                        var b = $(this).data("location"),
                            c = $(this).parent().children().index($(this));
                        Z.P(b, c);
                        previewCardSelection(a);
                        return false
                    }
                    if (3 == a.which) return false
                });
                d.mouseup(function(a) {
                    if (1 == a.which && Z.selection) {
                        a = $(this).data("location");
                        var b = $(this).parent().children().index($(this));
                        addCard(Z.selection.data("id"), a, b);
                        Z.aa();
                        return false
                    }
                });
                d.on("contextmenu", function() {
                    var a = $(this).data("location"),
                        b = $(this).parent().children().index($(this));
                    Z.P(a, b);
                    return false
                });
                d.data("id", a);
                d.data("alias", card.A);
                d.data("location", destination); 
                if(c === -1) {
                    k.append(d);
                    g.push(d);
                }
                else {
                    if(0 === c && 0 == k.children().length) {
                        k.append(d)
                    }
                    else {
                        k.children().eq(c).before(d);
                        g.splice(c, 0, d);
                    };
                }
                g = allowedCount(card);
                if(g !== 3) {
                    a = 2 === g ? "banlist-semilimited.png" : 1 === g ? "banlist-limited.png" : "banlist-banned.png";
                    a = $("<img>").attr("src", "assets/images/" + a);
                    d.data("banlist", a);
                    $("#editor-banlist-icons").append(a);
                } else {
                    d.data("banlist", null);
                }
                computePadding(destination);
                updateBanlistIcons(destination);
            }
        }
    };
    const addCard = function (...args) {
        addCardSilent(...args);
        addEditPoint();
    };
    Z.O = addCard;
    EXT.EDIT_API.addCard = addCard;
    EXT.EDIT_API.addCardSilent = addCardSilent;
    
    const removeCard = function (...args) {
        removeCardSilent(...args);
        addEditPoint();
    };
    Z.P = removeCard;
    EXT.EDIT_API.removeCard = removeCard;
    EXT.EDIT_API.removeCardSilent = removeCardSilent;
    
    const deepCloneArray = function (arr) {
        return arr.map ? arr.map(deepCloneArray) : arr;
    };
    const isRawObject = (obj) => typeof obj === "object";
    const deepEquals = function (left, right) {
        if(left.map && right.map) {
            if(left.length !== right.length) {
                return false;
            }
            return left.every((e, i) => deepEquals(e, right[i]));
        }
        else {
            if(isRawObject(left) && isRawObject(right)) {
                let leftEntries = Object.entries(left).sort();
                let rightEntries = Object.entries(right).sort();
                return deepEquals(leftEntries, rightEntries);
            }
            return left === right;
        }
    };
    const mapIDs = function (arr) {
        return arr.map(e => e.data("id"));
    };
    const currentDeckState = function () {
        return {
            main: mapIDs(Z.main),
            extra: mapIDs(Z.extra),
            side: mapIDs(Z.side)
        };
    }
    const clearLocation = function (location) {
        while(Z[location].length) {
            removeCardSilent(location, 0);
        }
    };
    const clearDeck = function () {
        for (let location of ["main", "extra", "side"]) {
            clearLocation(location);
        }
    };
    
    // for use in undo/redo - replaces the current state with the new state
    /*
               TypeError: Z[c][e].appendTo is not a function engine.min.js:144:115
                ma https://duelingnexus.com/script/engine.min.js?v=187:144
                restoreVisualState debugger eval code:387
                updateDeckState debugger eval code:933
                undo debugger eval code:987

    */
    const updateDeckState = function (newState) {
        let state = currentDeckState();
        clearVisualState();
        overMainExtraSide((contents, location) => {
            if(deepEquals(contents, newState[location])) {
                // console.warn("EXT.EDIT_API.updateDeckState - new and old sections for " + location + " are equal, not updating");
                return;
            }
            clearLocation(location);
            for (let id of newState[location]) {
                addCardSilent(id, location, -1);
            }
        });
        restoreVisualState();
    };
    EXT.EDIT_API.updateDeckState = updateDeckState;
    EXT.EDIT_API.currentDeckState = currentDeckState;
    EXT.EDIT_API.EDIT_HISTORY = [ currentDeckState() ];
    EXT.EDIT_API.EDIT_LOCATION = 0;
    
    const addEditPoint = function () {
        let state = currentDeckState();
        let previousState = lastElement(EXT.EDIT_API.EDIT_HISTORY);
        
        // do not add a duplicate entry
        if(previousState && deepEquals(state, previousState)) {
            return false;
        }
        
        // remove all entries past the current edit location
        if(EXT.EDIT_API.EDIT_LOCATION >= EXT.EDIT_API.EDIT_HISTORY.length) {
            EXT.EDIT_API.EDIT_HISTORY.splice(EXT.EDIT_API.EDIT_LOCATION);
        }
        
        // add the state
        EXT.EDIT_API.EDIT_HISTORY.push(state);
        
        // remove a state from the front if we have too many
        if(EXT.EDIT_API.EDIT_HISTORY.length > EXT.MAX_UNDO_RECORD) {
            EXT.EDIT_API.EDIT_HISTORY.shift();
        }
        
        // update the edit location
        EXT.EDIT_API.EDIT_LOCATION = EXT.EDIT_API.EDIT_HISTORY.length - 1;
        
        // we can no longer redo, but now we can undo
        undoButton.attr("disabled", false);
        redoButton.attr("disabled", true);
        
        return true;
    };
    
    EXT.EDIT_API.addEditPoint = addEditPoint;
    
    const undo = function () {
        // we can't undo if there's nothing behind us
        if(EXT.EDIT_API.EDIT_LOCATION === 0) {
            console.warn("EXT.EDIT_API.undo function failed - nothing to undo!");
            return false;
        }
        
        // we moved back one
        EXT.EDIT_API.EDIT_LOCATION--;
        
        // refresh the deck state
        updateDeckState(EXT.EDIT_API.EDIT_HISTORY[EXT.EDIT_API.EDIT_LOCATION]);
        
        // we can now redo
        redoButton.attr("disabled", false);
        
        // disable the undo button if there is nothing left to undo
        if(EXT.EDIT_API.EDIT_LOCATION === 0) {
            undoButton.attr("disabled", true);
        }
        
        return true;
    }
    EXT.EDIT_API.undo = undo;
    
    const redo = function () {
        // if we're at the front, we can't redo
        if(EXT.EDIT_API.EDIT_LOCATION === EXT.EDIT_API.EDIT_HISTORY.length - 1) {
            console.warn("EXT.EDIT_API.redo function failed - nothing to redo!");
            return false;
        }
        
        // move forward once
        EXT.EDIT_API.EDIT_LOCATION++;
        
        // refresh the deck state
        updateDeckState(EXT.EDIT_API.EDIT_HISTORY[EXT.EDIT_API.EDIT_LOCATION]);
        
        // we can now undo
        undoButton.attr("disabled", false);
        
        // disable the redo button if there is nothing left to redo
        if(EXT.EDIT_API.EDIT_LOCATION === EXT.EDIT_API.EDIT_HISTORY.length - 1) {
            redoButton.attr("disabled", true);
        }
        
        return true;
    }
    EXT.EDIT_API.redo = redo;
    
    /* reimplementing nexus buttons with edit history enabled */
    const clear = function () {
        clearVisualState();
        overMainExtraSide((contents, location) => {
            for(let el of Z[location]) {
                let banlist = el.data("banlist");
                if(banlist) {
                    banlist.remove();
                }
                el.remove();
            }
            Z[location] = [];
        });
        restoreVisualState();
        addEditPoint();
    }
    EXT.EDIT_API.clear = clear;
    
    // reset listener for editor's clear button
    let clearButton = $("#editor-clear-button");
    clearButton.unbind();
    clearButton.click(clear);
    
    const overMainExtraSide = function (it) {
        for(let name of ["main", "extra", "side"]) {
            it(Z[name], name);
        }
    };
    
    // sorts everything
    const sort = function () {
        clearVisualState();
        // for (var a = ["main", "extra", "side"], b = 0; b < a.length; ++b) {
            // var c = a[b];
            // Z[c].sort(function(a, b) {
                // return Z.fa(X[a.data("id")], X[b.data("id")])
            // });
            // updateBanlistIcons(c);
        // }
        overMainExtraSide((contents, location) => {
            contents.sort((c1, c2) => 
                Z.fa(X[c1.data("id")], X[c2.data("id")])
            );
            updateBanlistIcons(location);
        });
        restoreVisualState();
        addEditPoint();
    };
    
    // reset listener for editor's sort button
    let sortButton = $("editor-sort-button");
    sortButton.unbind();
    sortButton.click(sort);
    
    const shuffleAll = function () {
        clearVisualState();
        overMainExtraSide((contents, location) => {
            defaultShuffleList(contents);
            updateBanlistIcons(location);
        });
        restoreVisualState();
        addEditPoint();
    }
    
    let shuffleButton = $("#editor-shuffle-button");
    shuffleButton.unbind();
    shuffleButton.click(shuffleAll);
    
    // code for Export readable
    const countIn = function (arr, el) {
        return arr.filter(e => e === el).length;
    }

    const cardNamesInDeck = function (el) {
        let names = [...el.children()].map(e =>
            CARD_LIST[$(e).data("id")].name
        );
        let uniq = [...new Set(names)];
        return uniq.map(name =>
            `${countIn(names, name)}x ${name}`
        );
    }

    const outputDeck = function () {
        let decks = {
            Main: "#editor-main-deck",
            Extra: "#editor-extra-deck",
            Side: "#editor-side-deck",
        };
        
        return Object.entries(decks).map(([key, value]) =>
            [key + " Deck:", ...cardNamesInDeck($(value))]
            .join("\n")
        ).join("\n--------------\n");
    }
    
    /* UPDATE PAGE STRUCTURE */
    let editorMenuContent = $("#editor-menu-content");
    let saveButton = $("#editor-save-button");
    
    // remove annoying spacer
    
    $("#editor-menu-spacer").toggle(false);
    
    // add banlist selection
    let selector = makeElement("select", "rs-ext-banlist");
    for(let name of banlistNames) {
        selector.append(makeElement("option", null, name));
    }
    
    // TODO: "DRY" this.
    let updateBanlist = function () {
        console.info("Banlist changed to " + selector.val());
        EXT.BANLIST_NAME = selector.val();
        
        for(let pic of document.querySelectorAll(".editor-card-small")) {
            let el = $(pic);
            let id = el.data("alias") || el.data("id");
        
            let banlistIcon = el.find(".editor-search-banlist-icon");
            let limitStatus = allowedCount(id);
            // console.log(banlistIcon, pic, limitStatus);
            if(limitStatus !== 3) {
                if(!el.data("banlist")) {
                    let img = $("<img>");
                    el.data("banlist", img);
                    $("#editor-banlist-icons").append(img);
                }
                el.data("banlist").attr("src", "assets/images/" + banlistIcons[limitStatus]);
            }
            else if(el.data("banlist")) {
                el.data("banlist").remove();
                el.data("banlist", null);
            }
        }
        // update everything manually
        updateBanlistIcons("main");
        updateBanlistIcons("extra");
        updateBanlistIcons("side");
        computePadding("main");
        computePadding("extra");
        computePadding("side");
        updateSearchContents();
    };
    
    selector.change(updateBanlist);
    
    selector.insertBefore(saveButton);
    
    // add new buttons
    
    let undoButton = makeElement("button", "rs-ext-editor-export-button", "Undo");
    undoButton.prop("classList").add("engine-button", "engine-button", "engine-button-default");
    editorMenuContent.append(" ");
    editorMenuContent.append(undoButton);
    undoButton.attr("disabled", true);
    
    undoButton.click(undo);
    
    let redoButton = makeElement("button", "rs-ext-editor-export-button", "Redo");
    redoButton.prop("classList").add("engine-button", "engine-button", "engine-button-default");
    editorMenuContent.append(" ");
    editorMenuContent.append(redoButton);
    redoButton.attr("disabled", true);
    
    redoButton.click(redo);
    
    let exportButton = makeElement("button", "rs-ext-editor-export-button", "Export .ydk");
    exportButton.prop("classList").add("engine-button", "engine-button", "engine-button-default");
    exportButton.title = "Export Saved Version of Deck";
    editorMenuContent.append(" ");
    editorMenuContent.append(exportButton);
    
    exportButton.click(function () {
        let lines = [
            "#created by RefinedSearch plugin"
        ];
        for(let kind of ["main", "extra", "side"]) {
            let header = (kind === "side" ? "!" : "#") + kind;
            lines.push(header);
            // TODO: add option to use card.A rather than card.id
            lines.push(...Deck[kind]);
        }
        let message = lines.join("\n");
        download(message, Deck.name + ".ydk", "text");
    });
    
    let exportRawButton = makeElement("button", "rs-ext-editor-export-button", "Export Readable");
    exportRawButton.prop("classList").add("engine-button", "engine-button", "engine-button-default");
    exportRawButton.title = "Export Human Readable Version of Deck";
    editorMenuContent.append(" ");
    editorMenuContent.append(exportRawButton);
    
    exportRawButton.click(function () {
        let message = outputDeck();
        download(message, Deck.name + ".txt", "text");
    });
    
    let helpButton = makeElement("button", "rs-ext-show-help", "Help");
    helpButton.prop("classList").add("engine-button", "engine-button", "engine-button-default");
    editorMenuContent.append(" ");
    editorMenuContent.append(helpButton);
    
    helpButton.click(function () {
        let pages = [
            `By clicking any one of the "monster", "spell", and "trap" tabs, you can open a section which contains various search filters. There are two kinds of inputs: Drop-downs and text inputs. Drop-down lists give you a predefined set of options from which to choose. For example, a Trap may be either "Normal", "Continuous", or "Counter", so a drop-down menu is used. For features such as ATK and Level, you type a specific number, such as "2300" or "8".`,
            `For text inputs, you can put a comparison sign before the number to modify the expression. For example, typing ">=1500" in the "ATK" section will only show you monsters whose ATK value is at least 1500. The available operators are "=" (equality), "!=" (inequality), ">" (greater than), "<" (less than), ">=" (greater than or equal to), and "<=" (less than or equal to).`,
            `When searching by either card name or card effect, there are certain "wildcards" that you can use. The wildcard "_" will match any single character. For example, "b_t" matches "bot" and "bat". The wildcard "*" will match a sequence of any characters. "the*one" matches anything with the word "the" followed by the word "one", e.g., "Curtain of the Dark Ones".`,
            `You can place the "^" character at the beginning of your input to specify that you only want to match cards/effects which start with your given text. For example, "^blue" will match cards that begin with the word "blue", such as "Blue-Eyes White Dragon". Similarly, you can place "$" at the end of your input to specify that you only want to match ones which end with your given text. For example, "turtle$" will match cards that end with the word "turtle", such as "Gora Turtle". You can also use both! "^bat$" will only match "bat". No more, no less.`,
            `You can separate search queries with "&&" to represent that you want to match both queries in no particular order. If you want to search for a card effect that contains both "Tribute" and "GY" where you don't care about the order, you can use "Tribute&&GY", or "GY&&Tribute". You can also have a single "~" in your search query. Everything after that "~" indicates a search query you wish to exclude from your search. For example, if you want all effects which do not have the words "once per turn" in them, you could use "~once per turn". If you want to search for "GY" but not "discard", you could use "GY~discard".`
        ];
        NexusGUI.paginatedPopup("Help", pages);
    });
    
    // add options tile
    let optionsArea = makeElement("div", "options-area"); /* USES NEXUS DEFAULT CSS/ID */
    let options = makeElement("button", "rs-ext-options");
    options.prop("classList").add("engine-button", "engine-button", "engine-button-default");
    let cog = makeElement("i");
    cog.prop("classList").add("fa", "fa-cog");
    options.append(cog);
    appendTextNode(options, " Options");
    optionsArea.append(options);
    
    // TODO: implement option toggle area
    // document.body.append(optionsArea);
    
    let optionsWindow; /* USES NEXUS DEFAULT CSS/ID */
    let overflowDeckSizeElement;
    //;
    // makeElement("div", "options-window")
    optionsWindow = HTMLTag("div", "options-window", null,
        HTMLTag("p", null, null,
            overflowDeckSizeElement = makeElement("input", "rs-ext-decksize-overflow", { type: "checkbox" }),
            makeElement("label", null, "Enable deck overflow", { for: overflowDeckSizeElement.id })
        )
    );
    // TODO: add this
    
    // add css
    NexusGUI.addCSS(ADVANCED_SETTINGS_CSS_STRING);
    
    let searchText = $("#editor-search-text");
    
    // info box
    let infoBox = makeElement("div");
    
    styleHeaderNeutral(infoBox);
    infoBox.insertBefore(searchText);
    
    // advanced search settings
    for(let el of ADVANCED_SETTINGS_HTML_ELS) {
        $(el).insertBefore(searchText);
    }
    
    // page navigation bar
    let navigationHolder = makeElement("table", "rs-ext-navigation");
    let leftButton = makeElement("button", "rs-ext-navigate-left", "<");
    let rightButton = makeElement("button", "rs-ext-navigate-right", ">");
    for(let button of [leftButton, rightButton]) {
        button.addClass("engine-button");
        button.addClass("engine-button-default");
    }
    let pageInfo = makeElement("span", null, "Page ");
    let currentPageIndicator = makeElement("span","rs-ext-current-page", "X");
    let maxPageIndicator = makeElement("span", "rs-ext-max-page", "X");
    pageInfo.append(currentPageIndicator, " of ", maxPageIndicator);
    
    let spacerLeft = $("<td id=rs-ext-spacer-left>");
    let spacerRight = $("<td id=rs-ext-spacer-right>");
    
    // todo: finish
    let addRandomCardButton = $("<button id=rs-ext-add-random-card class='engine-button engine-button-default'>")
        .text("Random card")
        .attr("title", "Ech Button");
    
    addRandomCardButton.click(() => {
        let pool = EXT.Search.cache;
        if(!pool || pool.length === 0) {
            pool = Object.keys(CARD_LIST);
        }
        else {
            pool = pool.map(card => card.id);
        }
        if(pool.length < 100) {
            pool = pool.filter(id => countInDecks(id) < allowedCount(id));
            if(!pool.length) {
                return;
            }
        }
        let id, card, rind, destination;
        
        if(Z["main"].length === 60 && Z["extra"].length === 15) {
            return;
        }
        
        do {
            if(id) {
                pool.splice(rind, 1);
            }
            if(!pool.length) {
                return;
            }
            rind = Math.random() * pool.length | 0;
            console.log("new rind:", rind, pool.length);
            id = pool[rind];
            card = CARD_LIST[id];
            destination = isExtraDeckMonster(card) ? "extra" : "main";
        } while(countInDecks(id) >= allowedCount(id) || Z[destination].length === (destination === "extra" ? 15 : 60));
        
        // console.log(card, isExtraDeckMonster(card));
        addCard(id, destination, -1);
    });
    
    spacerRight.append(addRandomCardButton);
    
    let buttonHolder = $("<td id=rs-ext-button-holder>");
    buttonHolder.append(leftButton, pageInfo, rightButton);
    
    navigationHolder.append(spacerLeft, buttonHolder, spacerRight);
    
    styleHeaderNeutral(navigationHolder);
    noSelect(navigationHolder);
    
    navigationHolder.insertBefore(searchText);
    
    // wire event listeners for advanced search settings
    let toggleButtonState = function () {
        let classList = this.prop("classList");
        let isSelected = classList.contains("rs-ext-selected");
        if(isSelected) {
            classList.remove("rs-ext-selected");
        }
        else {
            classList.add("rs-ext-selected");
        }
        updateSearchContents();
    };
    [...$(".rs-ext-toggle-button")].forEach(el => {
        el = $(el);
        el.click(toggleButtonState.bind(el));
    });
    
    let monsterTab = $("#rs-ext-monster");
    let spellTab = $("#rs-ext-spell");
    let trapTab = $("#rs-ext-trap");
    let sortTab = $("#rs-ext-sort");
    
    let spacer = $("#rs-ext-spacer");
    
    // returns `true` if the object is visible, `false` otherwise
    let toggleShrinkable = function (target, state = null) {
        let isShrunk = state;
        if(isShrunk === null) {
            isShrunk = target.hasClass("rs-ext-shrunk");
        }
        if(isShrunk) {
            target.addClass("rs-ext-activated");
            target.removeClass("rs-ext-shrunk");
            return true;
        }
        else {
            target.addClass("rs-ext-shrunk");
            target.removeClass("rs-ext-activated");
            return false;
        }
        // equiv. `return isShrunk;`, changed for clarity
    }
    
    let createToggleOtherListener = function (target, ...others) {
        return function () {
            let wasShrunk = toggleShrinkable(target);
            if(wasShrunk) {
                others.forEach(other => other.addClass("rs-ext-shrunk"));
            }
            updateSearchContents();
        }
    };
    
    $("#rs-ext-monster-toggle")
        .click(createToggleOtherListener(monsterTab, spellTab,   trapTab));
    $("#rs-ext-spell-toggle")
        .click(createToggleOtherListener(spellTab,   monsterTab, trapTab));
    $("#rs-ext-trap-toggle")
        .click(createToggleOtherListener(trapTab,    monsterTab, spellTab));
    
    
    $("#rs-ext-sort-toggle").click(() => {
        toggleShrinkable(sortTab);
    });
    
    const currentSections = function () {
        return [monsterTab, spellTab, trapTab, sortTab].filter(el => !el.hasClass("rs-ext-shrunk")) || null;
    }
    window.currentSections = currentSections;
    
    // TODO: clientHeight might be deprecated
    const updatePaddingHeight = function () {
        let sections = currentSections();
        let height = FN.sum(sections.map(section => section[0].clientHeight));
        spacer.css("height", height + "px");
        // update top position of sort, if necessary
        if(!sortTab.hasClass("rs-ext-shrunk")) {
            sortTab.css("top", (height - sortTab[0].clientHeight) + "px");
        }
    }
    let interval = setInterval(updatePaddingHeight, 1);
    console.info("Padding height interval started. ", interval);
    
    const LINK_ARROW_MEANING = {
        "Bottom-Left":      0b000000001,
        "Bottom-Middle":    0b000000010,
        "Bottom-Right":     0b000000100,
        "Center-Left":      0b000001000,
        // "Center-Middle":    0b000010000,
        "Center-Right":     0b000100000,        
        "Top-Left":         0b001000000,
        "Top-Middle":       0b010000000,
        "Top-Right":        0b100000000,
    };
    
    const UNICODE_TO_LINK_NUMBER = {
        "\u2196":   LINK_ARROW_MEANING["Top-Left"],
        "\u2191":   LINK_ARROW_MEANING["Top-Middle"],
        "\u2197":   LINK_ARROW_MEANING["Top-Right"],
        "\u2190":   LINK_ARROW_MEANING["Center-Left"],
        // no center middle
        "\u2192":   LINK_ARROW_MEANING["Center-Right"],
        "\u2199":   LINK_ARROW_MEANING["Bottom-Left"],
        "\u2193":   LINK_ARROW_MEANING["Bottom-Middle"],
        "\u2198":   LINK_ARROW_MEANING["Bottom-Right"],
        
        // meaningless
        "=":        0b0,    
    };
    const convertUnicodeToNumber = function (chr) {
        return UNICODE_TO_LINK_NUMBER[chr] || 0;
    }
    
    const tagStringOf = function (tag, value = null, comp = "", inversion = false) {
        let invert = inversion ? "!" : "";
        if(value !== null) {
            return "{" + invert + tag + " " + comp + value + "}";
        }
        else {
            return "{" + invert + tag + "}";
        }
    }
    
    // various elements
    const INPUTS_USE_QUOTES = {
        "TYPE": true,
    };
    const MONSTER_INPUTS = {
        ARROWS:     [...$(".rs-ext-toggle-button")],
        TYPE:       $("#rs-ext-monster-type"),
        ATTRIBUTE:  $("#rs-ext-monster-attribute"),
        LEVEL:      $("#rs-ext-level"),
        SCALE:      $("#rs-ext-scale"),
        LIMIT:      $("#rs-ext-monster-limit"),
        ATK:        $("#rs-ext-atk"),
        DEF:        $("#rs-ext-def"),
        CATEGORY:   $("#rs-ext-monster-category"),
        ABILITY:    $("#rs-ext-monster-ability"),
    };
    const INPUT_TO_KEYWORD = {
        // ARROWS: "ARROWS",
        TYPE: "TYPE",
        ATTRIBUTE: "ATTR",
        LEVEL: "LEVIND",
        ATK: "ATK",
        DEF: "DEF",
        SCALE: "SCALE",
        LIMIT: "LIMIT",
    };
    const CATEGORY_TO_KEYWORD = {
        // primary
        "Normal": "NORMAL",
        "Effect": "EFFECT",
        "Ritual": "RITUAL",
        "Fusion": "FUSION",
        "Synchro": "SYNC",
        "Xyz": "XYZ",
        "Pendulum": "PEND",
        "Link": "LINK",
        // derived
        "Leveled": "LEVELED",
        "Extra Deck": "EXTRA",
        "Non-Effect": "NONEFF",
        // secondary
        "Flip": "FLIP",
        "Spirit": "SPIRIT",
        "Gemini": "GEMINI",
        "Toon": "TOON",
        "Tuner": "TUNER",
    };
    const CATEGORY_SOURCES = [ "CATEGORY", "ABILITY" ];
    const monsterSectionTags = function () {
        let tagString = "{MONSTER}";
        
        // links
        let selectedArrows = MONSTER_INPUTS.ARROWS.filter(arrow => arrow.classList.contains("rs-ext-selected"));
        let selectedSymbols = selectedArrows.map(arrow => arrow.textContent);
        let bitmaps = selectedSymbols.map(convertUnicodeToNumber);
        let mask = bitmaps.reduce((a, c) => a | c, 0b0);
        
        if(mask) {
            let comp = (selectedSymbols.indexOf("=") !== -1) ? "=" : "&";
            tagString += tagStringOf("ARROWS", mask, comp);
        }
        
        // category
        for(let category of CATEGORY_SOURCES) {
            let value = MONSTER_INPUTS[category].val();
            if(value) {
                let keyword = CATEGORY_TO_KEYWORD[value];
                tagString += tagStringOf(keyword);
            }
        }
        
        for(let [inputName, tagName] of Object.entries(INPUT_TO_KEYWORD)) {
            let inputElement = MONSTER_INPUTS[inputName];
            let value = inputElement.val();
            if(!value) continue;
            let inversion = false;
            if(value[0] === "!" && value[1] !== "=") {
                inversion = true;
                value = value.slice(1);
            }
            if(INPUTS_USE_QUOTES[inputName]) {
                value = '"' + value + '"';
            }
            switch(inputElement.tagName()) {
                case "INPUT":
                    tagString += tagStringOf(tagName, value, "", inversion);
                    break;
                case "SELECT":
                    tagString += tagStringOf(tagName, value, "", inversion);
                    break;
                default:
                    console.error("Fatal error: unknown");
                    break;
            }
        }
        
        return tagString;
    }
    
    const SPELL_TRAP_INPUTS = {
        SPELL:       $("#rs-ext-spell-type"),
        SPELL_LIMIT: $("#rs-ext-spell-limit"),
        TRAP:        $("#rs-ext-trap-type"),
        TRAP_LIMIT:  $("#rs-ext-trap-limit"),
    };
    const SPELL_TO_KEYWORD = {
        "Normal": "NORMALST",
        "Quick-play": "QUICK",
        "Field": "FIELD",
        "Continuous": "CONT",
        "Ritual": "RITUALST",
        "Equip": "EQUIP",
    };
    const spellSectionTags = function () {
        let tagString = "{SPELL}";
        
        let value = SPELL_TRAP_INPUTS.SPELL.val();
        if(value) {
            let keyword = SPELL_TO_KEYWORD[value];
            tagString += tagStringOf(keyword);
        }
        
        let limit = SPELL_TRAP_INPUTS.SPELL_LIMIT.val();
        if(limit) {
            tagString += tagStringOf("LIM", limit);
        }
        
        return tagString;
    };
    
    const TRAP_TO_KEYWORD = {
        "Normal": "NORMALST",
        "Continuous": "CONT",
        "Counter": "COUNTER",
    };
    const trapSectionTags = function () {
        let tagString = "{TRAP}";
        
        let value = SPELL_TRAP_INPUTS.TRAP.val();
        if(value) {
            let keyword = TRAP_TO_KEYWORD[value];
            tagString += tagStringOf(keyword);
        }
        
        let limit = SPELL_TRAP_INPUTS.TRAP_LIMIT.val();
        if(limit) {
            tagString += tagStringOf("LIM", limit);
        }
        
        return tagString;
    }
    
    const generateSearchFilters = function () {
        let tags = "";
        for(let section of currentSections()) {
            switch(section) {
                case monsterTab:
                    tags += monsterSectionTags();
                    break;
                    
                case spellTab:
                    tags += spellSectionTags();
                    break;
                    
                case trapTab:
                    tags += trapSectionTags();
                    break;
                    
                // case null:
                default: 
                    break;
            }
        }
        return tags;
    }
    
    /* main code */
    
    const COMPARATORS = {
        ">":  function (x, y) { return x  >  y; },
        "<":  function (x, y) { return x  <  y; },
        "=":  function (x, y) { return x === y; },
        // used exclusively for masks
        "&":  function (x, y) { return (x & y) == y; },
        // "!":  function (x, y) { return x !== y; },
        "!=": function (x, y) { return x !== y; },
        "<=": function (x, y) { return x  <= y; },
        ">=": function (x, y) { return x  >= y; },
    };
    const generateComparator = function(compIdentifier) {
        let comp = COMPARATORS[compIdentifier];
        if(comp) {
            return comp;
        }
        else {
            return null;
        }
    }
    
    const createKindValidator = function (tagName) {
        tagName = tagName.toUpperCase();
        if(kindMap[tagName]) {
            return kindMap[tagName];
        } else {
            addMessage(STATUS.ERROR, "No such kind tag: " + tagName);
            return null;
        }
    }
    
    const VALIDATOR_ONTO_MAP = {
        "ATK": "attack",
        "DEF": "i",
        "ARROWS": "i",
        "SCALE": "xa", // left scale
    };
    const VALIDATOR_LEVEL_MAP = {
        "LEVEL": isLevelMonster,
        "LV": isLevelMonster,
        "RANK": isXyzMonster,
        "RK": isXyzMonster,
        "LINK": isLinkMonster,
        "LR": isLinkMonster,
        "LI": () => true,
        "LEVIND": () => true,
    };
    
    const initialCapitalize = function (str) {
        return str.replace(/\w+/g, function (word) {
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        });
    }
    
    
    // returns a validation function
    /*
     * ALLOWED PARAMETERS:
     * ATK, num - search for atk 
     * DEF, num - search for atk
     * LIM, num - search by limit status (0 = banned, 1 = limited, 2 = semi-limited, 3 = unlimited)
     * LV,  num - search by level indicator
     * LEVEL,RANK,RK,LINK,LR - same for respective type
     *
     *
     * tag {
     *     value: compare to
     *     param: tag name
     *     comp:  functional comparator
     * }
     */
    const createValidator = function (tag) {
        if(VALIDATOR_ONTO_MAP[tag.param]) {
            let value;
            if(tag.value === "?") {
                value = -2;
            }
            else {
                value = parseInt(tag.value, 10);
            }
            let prop = VALIDATOR_ONTO_MAP[tag.param];
            return function (cardObject) {
                let objectValue = cardObject[prop];
                if(tag.param === "DEF" && isLinkMonster(cardObject)) {
                    return false;
                }
                if(tag.param === "ARROWS" && !isLinkMonster(cardObject)) {
                    return false;
                }
                if(tag.param === "SCALE" && !isPendulumMonster(cardObject)) {
                    return false;
                }
                return isMonster(cardObject) && tag.comp(objectValue, value);
            };
        }
        else if(VALIDATOR_LEVEL_MAP[tag.param]) {
            let check = VALIDATOR_LEVEL_MAP[tag.param];
            let level = parseInt(tag.value, 10);
            return function (cardObject) {
                return check(cardObject) && tag.comp(cardObject.level, level);
            }
        }
        else if(tag.param === "LIM" || tag.param === "LIMIT") {
            if(/^\d+$/.test(tag.value)) {
                let value = parseInt(tag.value, 10);
                return function (cardObject) {
                    let count = allowedCount(cardObject);
                    return tag.comp(count, value);
                };
            }
            else {
                addMessage(STATUS.ERROR, "Invalid numeral " + tag.value + ", ignoring tag");
                return function () {
                    return true;
                };
            }
        }
        else if(tag.param === "NAME") {
            let sub = sanitizeText(tag.value);
            return function (cardObject) {
                return sanitizeText(cardObject.Z).indexOf(sub) !== -1;
            };
        }
        else if(tag.param === "TYPE") {
            let searchType = initialCapitalize(tag.value);
            if(TYPE_LIST.indexOf(searchType) !== -1) {
                return function (cardObject) {
                    return monsterType(cardObject) == searchType;
                };
            }
            else {
                addMessage(STATUS.ERROR, "Invalid type " + tag.value + ", ignoring tag");
                return function () {
                    return true;
                };
            }
        }
        else if(tag.param === "ATTR" || tag.param === "ATTRIBUTE") {
            let searchAttribute = tag.value.toUpperCase();
            let attributeMask = ATTRIBUTE_HASH[searchAttribute];
            if(attributeMask !== undefined) {
                attributeMask = parseInt(attributeMask, 10);
                return function (cardObject) {
                    return tag.comp(attributeOf(cardObject), attributeMask);
                };
            }
            else {
                addMessage(STATUS.ERROR, "Invalid attribute " + tag.value + ", ignoring tag");
                return function () {
                    return true;
                };
            }
        }
        else {
            addMessage(STATUS.ERROR, "No such parameter supported: " + tag.param);
            return null;
        }
    }
    
    const ISOLATE_COMPARATOR_REGEX = /^([&=]|[!><]=?)?(.+)/;
    
    // returns 1 or 2 elements
    const isolateComparator = function (str) {
        let [_, comp, rest] = str.match(ISOLATE_COMPARATOR_REGEX);
        return [rest, comp].filter(e => e);
    }
    
    const expressionToPredicate = function (expression, param, defaultComp = "=") {
        let [rest, comp] = isolateComparator(expression);
        comp = comp || defaultComp;
        let fn = generateComparator(comp);
        if(!fn) {
            throw new Error("Invalid comparator: " + comp);
        }
        
        let tag = {
            value: rest,
            param: param.toUpperCase(),
            comp: fn,
        };
        
        return createValidator(tag);
    }
    
    const operatorFunctions = {
        "OR": FN.or,
        "AND": FN.and,
    };
    const operatorNameToFunction = function (opName) {
        let fn = operatorFunctions[opName];
        return fn;
    }

    const textToPredicate = function (text, param) {
        let tokens = SearchInputShunter.parseSections(text);
        let stack = [];
        for(let token of tokens) {
            if(token.type === TokenTypes.EXPRESSION) {
                stack.push(expressionToPredicate(token.raw, param));
            }
            else if(token.type === TokenTypes.OPERATOR) {
                let right = stack.pop();
                let left = stack.pop();
                if(!left || !right) {
                    throw new Error("Insufficient arguments (incomplete input)");
                }
                let fn = operatorNameToFunction(token.raw);
                stack.push(FN.hook(left, fn, right));
            }
        }
        if(stack.length === 0) {
            addMessage(STATUS.ERROR, "Malformed input, not enough tokens.");
            return null;
        }
        return stack.pop();
    }
    
    const compare = (a, b) => (a > b) - (a < b);
    const compareBy = (f, rev = false) =>
        (a, b) => compare(f(a), f(b)) * (rev ? -1 : 1);
    
    // TODO: put traps always at end
    const SORT_BY_COMPARATORS = {
        "Name": compareBy(x => x.name),
        "Level": compareBy(x => x.level),
        "ATK": compareBy(x => x.attack),
        "DEF": compareBy(x => x.i),
        // "SCALE": compareBy(x => x.xa),
        
        // TODO: sort each sub-strata? e.g. all level 1s by name
        // "Level": compareByAlterantives("level", "name"),
        // "ATK": compareByAlterantives("attack", "name"),
        // "DEF": compareByAlterantives("i", "name"),
    };
    let STRATA_KINDS = {
        LEVELED: [ isLevelMonster, isXyzMonster, isLinkMonster, isSpellCard, isTrapCard ],
        DEFAULT: [ isNormalMonster, isBasicMainDeckMonster, isRitualMonster, isFusionMonster, isSynchroMonster, isXyzMonster, isLinkMonster, isLevelMonster, isSpellCard, isTrapCard ],
    };
    let formStrata = function (list, by = "DEFAULT") {
        let fns = STRATA_KINDS[by];
        let strata = fns.map(e => []);
        for(let card of list) {
            let index = fns.findIndex(fn => fn(card));
            if(index !== -1) {
                strata[index].push(card);
            }
            else {
                console.error("Index not found in strata array", card);
            }
        }
        return strata;
    };
    let sortCardList = function (list, options) {
        let { methods, reverse, stratify, strataKind } = options;
        if(!Array.isArray(methods)) {
            methods = [ methods, "Name", "Level", "ATK", "DEF" ];
        }
        if(stratify) {
            let strata = formStrata(list, strataKind).map(stratum => 
                sortCardList(stratum, {
                    methods: methods,
                    reverse: reverse,
                    stratify: false,
                })
            );
            return [].concat(...strata);
        }
        let cmps = methods.map(method => SORT_BY_COMPARATORS[method]);
        let sorted = list.sort((a, b) => {
            for(let cmp of cmps) {
                let diff = cmp(a, b);
                if(diff !== 0) {
                    return diff;
                }
            }
            return 0;
        });
        if(reverse) {
            sorted.reverse();
        }
        return sorted;
    }
    
    let ensureCompareText = function (card) {
        card.compareText = card.compareText || card.description.toUpperCase();
        return card.compareText;
    };
    let parseInputQuery = function (text) {
        let result = {
            include: [],
            exclude: []
        };
        let i = 0;
        for(let section of text.split("~")) {
            for(let combo of section.split("&&")) {
                let prepend = "";
                let append = "";
                let inner = combo.toString().trim();
                if(inner[0] === "^") {
                    prepend = inner[0];
                    inner = inner.slice(1);
                }
                if(lastElement(inner) === "$") {
                    append = lastElement(inner);
                    inner = inner.slice(0, -1);
                }
                inner = escapeRegex(inner);
                inner = inner.replace(/\\\*/g, ".*")
                             .replace(/_/g, ".")
                             .replace(/\\\\([xsn])/g, "\\$1");
                let compiled = prepend + inner + append;
                let regex = new RegExp(compiled, "i");
                
                let source;
                if(i === 0) {
                    source = result.include;
                }
                else if(i === 1) {
                    source = result.exclude;
                }
                else {
                    console.error("No such source index " + i);
                    source = [];
                }
                
                source.push(regex);
            }
            i++;
        }
        
        // TODO: make this a class
        // console.log(result);
        result.matches = function (text) {
            return result.exclude.every(exclusion => text.search(exclusion) === -1) &&
                   result.include.every(inclusion => text.search(inclusion) !== -1);
        };
        result.matchesExactly = function (text) {
            if(result.include.length > 1) {
                return false;
            }
            let include = result.include[0];
            let [ match ] = text.match(result.include) || [];
            return match === text;
        };
        return result;
    };
    // window.parseInputQuery=parseInputQuery;
    const ISOLATE_TAG_REGEX = /\{(!?)(\w+)([^\{\}]*?)\}/g;
    let updateSearchContents = function () {
        clearVisualSearchOptions();
        initializeMessageContainer();
        // TODO: move sanitation process later in the procedure
        let input = $("#editor-search-text").val();
        let effect = $("#editor-search-effect").val() || "";
        
        // append tags generated by search options
        let extraTags = generateSearchFilters();
        if(extraTags) {
            input += extraTags;
        }
        
        // isolate the tags in the input
        let tags = [];
        input = input.replace(ISOLATE_TAG_REGEX, function (match, isNegation, param, info) {
            // over each tag:
            let validator;
            try {
                if(info) {
                    validator = textToPredicate(info, param);
                }
                else {
                    validator = createKindValidator(param);
                }
            } catch(error) {
                addMessage(STATUS.ERROR, "Problem creating validator: " + error.message);
                return "";
            }
            
            if(validator) {
                if(isNegation) {
                    validator = FN.compose(FN.not, validator);
                }
                tags.push(validator);
            }
            else if(validator !== null) {
                addMessage(STATUS.ERROR, "Invalid validator (bug, please report): " + match);
            }
            
            // remove the tag, replace with nothing
            return "";
        });
        
        // remove any improper tags
        input = input.replace(/\{[^\}]*$/, function (tag) {
            addMessage(STATUS.NEUTRAL, "Removed incomplete tag: " + tag);
            return "";
        });
        
        // needs non-empty input
        if (input.length !== 0 || effect.length !== 0 || tags.length !== 0) {
            let exactMatches = [];
            let fuzzyMatches = [];
            
            let cardId = parseInt(input, 10);
            
            // if the user is searching by ID
            if(!isNaN(cardId)) {
                cardId = CARD_LIST[cardId];
                if(cardId && isPlayableCard(cardId)) {
                    fuzzyMatches.push(cardId);
                }
            }
            
            // only if the user is not searching by a valid ID
            let hasTags = tags.length !== 0;
            let isLongEnough = input.length >= EXT.MIN_INPUT_LENGTH || effect.length >= EXT.MIN_INPUT_LENGTH;
            let isFuzzySearch = hasTags || isLongEnough;
            
            // let uppercaseInput = input.toUpperCase();
            
            let effectQuery = parseInputQuery(effect);
            let nameQuery = parseInputQuery(input);
            // let nameQuery = parseInputQuery(uppercaseInput.replace(/ /g, ""))));
            
            if (0 === fuzzyMatches.length) {
                // for each card ID
                for (var e in CARD_LIST) {
                    let card = CARD_LIST[e];
                    if(!isPlayableCard(card) || !allSatisfies(tags, card)) {
                        continue;
                    }
                    let compareName = searchableCardName(card);
                    if(nameQuery.matchesExactly(compareName)) {
                        // if the search name is the input, push it
                        exactMatches.push(card);
                    } else if(isFuzzySearch) {
                        ensureCompareText(card);
                        let cardMatchesName = nameQuery.matches(compareName);
                        let cardMatchesEffect = effectQuery.matches(card.compareText);
                        if(cardMatchesName && cardMatchesEffect) {
                            fuzzyMatches.push(card);
                        }
                    }
                }
            }
            
            // sort the results
            let method = $("#rs-ext-sort-by").val();
            let reverseResults = $("#rs-ext-sort-order").val() === "Descending";
            let stratify = $("#rs-ext-sort-stratify").prop("checked");
            let strataKind;
            if(method === "Level") {
                strataKind = "LEVELED";
                stratify = true;
            }
            let params = {
                methods: method,
                reverse: reverseResults,
                stratify: stratify,
                strataKind: strataKind,
            };
            exactMatches = sortCardList(exactMatches, params);
            fuzzyMatches = sortCardList(fuzzyMatches, params);
            // exactMatches.sort(cardCompare);
            // fuzzyMatches.sort(cardCompare);
            
            // display 
            let totalEntryCount = exactMatches.length + fuzzyMatches.length;
            let displayAmount = Math.min(totalEntryCount, EXT.RESULTS_PER_PAGE);
            if(displayAmount === 0) {
                EXT.Search.cache = [];
                if(isFuzzySearch) {
                    let suggestion;
                    if(hasTags) {
                        suggestion = "Try changing or removing some tags.";
                    }
                    else {
                        suggestion = "Check your spelling and try again.";
                    }
                    if(input.replace(/\W/g, "").toLowerCase() == "sock") {
                        addMessage(STATUS.ERROR, "No results found. If you're looking for me, try Sock#3222 on discord :D");
                    }
                    else {
                        addMessage(STATUS.ERROR, "No results found. " + suggestion);
                    }
                }
                else {
                    addMessage(STATUS.ERROR, "Your input was too short. Try typing in some text or adding some tags.");
                }
            }
            else {
                let cache = exactMatches.concat(fuzzyMatches);
                EXT.Search.cache = cache;
                // RESULTS_PER_PAGE can change between calculations
                EXT.Search.per_page = EXT.RESULTS_PER_PAGE;
                EXT.Search.current_page = 1;
                EXT.Search.max_page = Math.ceil(EXT.Search.cache.length / EXT.Search.per_page);
                
                replaceTextNode(currentPageIndicator, EXT.Search.current_page);
                replaceTextNode(maxPageIndicator, EXT.Search.max_page);
                
                let message = "";
                
                let anyErrors = EXT.Search.messages.some(
                    message => message[0] == STATUS.ERROR
                );
                message += "Search successful";
                if(anyErrors) {
                    message += ", but there were some errors";
                }
                message += ". Found " + totalEntryCount + " ";
                message += pluralize("entr", totalEntryCount, "ies", "y");
                message += " (" + EXT.Search.max_page + " " + pluralize("page", EXT.Search.max_page) + ")";
                addMessage(anyErrors ? STATUS.NEUTRAL : STATUS.SUCCESS, message);
            }
        }
        else {
            EXT.Search.cache = [];
            replaceTextNode(currentPageIndicator, "X");
            replaceTextNode(maxPageIndicator, "X");
            addMessage(STATUS.NEUTRAL, "Please enter a search term to begin.");
        }
        displayResults();
    };
    
    // add new input function
    $("#editor-search-text").on("input", updateSearchContents)
    updateSearchContents();
    
    // add search by effect
    $("#editor-search-text").wrap($("<div class=rs-ext-flex></div>"));
    let searchWrapper = $("#editor-search-text").parent();
    let editorSearchByEffect = $("<input type=text class=engine-text-box id=editor-search-effect></input>");
    searchWrapper.append(editorSearchByEffect);
    editorSearchByEffect.on("input", updateSearchContents);
    
    // update attributes
    $("#editor-search-text").attr("placeholder", "Search by name/query");
    editorSearchByEffect.attr("placeholder", "Search by effect");
    
    // add relevant listeners
    let allInputs = [
        [...document.querySelectorAll("#rs-ext-monster-table input, #rs-ext-monster-table select")],
        Object.values(SPELL_TRAP_INPUTS),
        [...document.querySelectorAll("#rs-ext-sort-table input, #rs-ext-sort-table select")],
    ].flat();
    
    for(let input of allInputs) {
        $(input).on("input", updateSearchContents);
    }
    
    $("#rs-ext-clear-filter").click(() => {
        for(let input of allInputs) {
            let jq = $(input);
            if(jq.tagEquals("select")) {
                jq.val(jq.children()[0].text).change();
            }
            else if(jq.val) {
                jq.val("");
            }
            else if(jq.hasClass("rs-ext-selected")) {
                jq.click();
            }
        }
        // shrink existing sections
        currentSections().forEach(section => toggleShrinkable(section));
        
        updateSearchContents();
    });
    
    let previousPage = function () {
        EXT.Search.current_page = Math.max(1, EXT.Search.current_page - 1);
        displayResults();
    }
    let nextPage = function () {
        EXT.Search.current_page = Math.min(EXT.Search.max_page, EXT.Search.current_page + 1);
        displayResults();
    }
    $(leftButton).on("click", previousPage);
    $(rightButton).on("click", nextPage);
    
    updateBanlist();
};

let checkStartUp = function () {
    if(Z.za) {
        onStart();
        // destroy reference; pseudo-closure
        onStart = null;
    }
    else {
        setTimeout(checkStartUp, 100);
    }
}

checkStartUp();
} catch(e) {
    console.error("Error while running!", e);
}