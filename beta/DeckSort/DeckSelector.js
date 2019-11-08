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
    
    for(let button of buttons) {
        let tag = isolateTag(button);
        let color = tagColors[tag];
        if(color) {
            $(button).css("color", color);
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
    gameDeckSelection.prepend($("<div>").append(
        $("<span>Search by name: </span>"), searchDeckInput
    ));
    
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
};

let startUpDeckSelector = function () {
    waitForElementJQuery("#game-deck-dropdown:visible").then(() => {
        console.log("starting DeckSelector.js!");
        onStartDeckSelector();
    });
};