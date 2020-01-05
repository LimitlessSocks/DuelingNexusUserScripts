let onStartDeckSelector = function () {
    let gameDeckSelection = $("#game-deck-selection");
    let buttons = gameDeckSelection.find("button");
    
    gameDeckSelection.css("max-height", "20em")
                     .css("overflow-y", "auto");
    
    let specifiers = [];
    for(let button of buttons) {
        if(button.textContent.startsWith("!! ")) {
            specifiers.push(button.textContent.slice(3));
            button.parentNode.remove();
        }
    }
    
    let tagColors = {};
    
    specifiers.join(";").split(";").forEach(spec => {
        let [ tag, color ] = spec.split(":");
        tagColors[tag] = color;
    });
    
    let selectedDeckName = $("#game-selected-deck-name");
    let currentTag = isolateTag(selectedDeckName.text().replace(/^Deck: /, ""));
    
    for(let button of buttons) {
        let tag = isolateTag(button);
        let color = tagColors[tag] || "auto";
        $(button).css("color", color);
        $(button).click(() => {
            selectedDeckName.css("color", color);
        });
        if(tag === currentTag) {
            selectedDeckName.css("color", color);
        }
    }
    
    let matchesFilter = function (text, query) {
        return text.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    }
    
    const filterDecks = function (query) {
        for(let button of buttons) {
            let text = button.textContent;
            $(button.parentNode).toggle(matchesFilter(text, query));
        }
    };
    DeckSort.filterDecksInGame = filterDecks;
    
    // add search bar
    let searchDeckInput = $("<input id=ds-ext-search-deck></div>");
    let randomDeck = $("<button id=ds-ext-random-deck class=engine-button>Random</button>");
    gameDeckSelection.prepend($("<div>").append(
        $("<span>Search by name: </span>"), searchDeckInput, randomDeck
    ));
    
    randomDeck.click(() => {
        let shownButtons = buttons.filter(":visible");
        let count = shownButtons.length;
        let index = Math.floor(Math.random() * count);
        let button = shownButtons[index];
        button.click();
    });
    
    // modified from https://stackoverflow.com/a/17384341/4119004
    searchDeckInput.on("input propertychange paste", function (ev) {
        let valueChanged = false;
        
        if(ev.type === "propertychange") {
            valueChanged = ev.originalEvent.propertyName === "value";
        }
        else {
            valueChanged = true;
        }
        
        if(valueChanged) {
            let query = searchDeckInput.val();
            filterDecks(query);
        }
    });
    
    $("#game-deck-dropdown").click(function () {
        searchDeckInput.focus();
    });
};

let startUpDeckSelector = function () {
    waitForElementJQuery("#game-deck-dropdown:visible").then(() => {
        console.log("starting DeckSelector.js!");
        onStartDeckSelector();
    });
};