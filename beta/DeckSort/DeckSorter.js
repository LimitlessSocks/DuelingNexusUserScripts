let onStartDeckSorter = async function () {
    const MINIMIZE_SYMBOL = "\u2212";
    const MAXIMIZE_SYMBOL = "+";
    const OPTIONS_COG_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wsJBxwcoeWqgAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACn0lEQVRYw+WXO2hUQRSG/9l1o24SY1BRC40QjU1SKIIpNEVEUBRJYaekEREjWKWy0FRiFcEHiBBQLKy0EUS08AE2SbDQQlMYfIuurCYhLMndnc9most17ubuuhsQD0wznMd/nnNG+t/JVCoIXJe0U1IgKSGp3RgzsyCogT3AJ35TAJyphaF6IOm5P8uf9DpCR1OlxtcB14A+YAuQdvebgBceAD+Aw44naa3dDBwA7gGdZRm31rYAj4uUZ4BLQC9wlWgatdYeAgaAlyFw3XE9XwbcoPr0CmgP20uEL3K5XE7SWA1qN5vP59/PCyCdTgeSnkiaqKLxQNKjVCo1ETcNjTHSYIFC0bEleN8BG3y2Et7pZMyUpOEIfAVJdyV1GmOSxpikpBZJFyXlfP5IGjfGvCmnBdcDQx5PZoHTJeS6gK++CARBsBGoK2XUAN3AKeB5UZjnqADciQH+uAMapm/AeWttD9DgExwCPpTI4wzQFQNACzBSQs8UcB9YHBbMzFN002Wk8HaMuVAfLsJcFduuEJexGMASV7GRvEBrDO+XS1pZCYBWSYOSMhHRSEk6GUPnbkkdnvu8pO+SbklqM8ZMl/KiDxjz5C0L7JinfR945CaBc8CqcmbBiYji+QwcKZ5swAqgx1U3nqn4NMrOIu+rkc0m3HTz0RpJVySNAOOu4NZK2iap2dVReNVrBOqMMbNxve+ISEGlNAUcjf0WSGqX1FbFtmyQtC8WAFcox2qwD2wFdsVNwV4gF9p6vwCjEY/Nr2np9sXxkHweuFDuUnoQeAs8Awbnqt4tqJMRL+WA42kA+oGHrmsuV7oZbw+/XMBSty2H6SOw2qNjfy3+C72hEBeAmwv2nwOageFQBCrqmr/5GzZJqpsbPMaYzD/5O/4JriesdkG3NSwAAAAASUVORK5CYII=";
    const MOVE_ARROWS_BASE64 = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AEGBwAAXEWT3QAAAOtJREFUWMPtl8sRhCAQRKm9r1lJPKsRGILZaQBiGL69YC2lDvhhlQN9ZIBp5tPFKHUBQAM06glY5zOaJ53fS0Jwfg+JgPP/kgBa9qNVGRlXCy5gr4HeKboeqK/cuWo1wVYAxlP9BiiEs+EWdftcsBtgAkZAO+ulYzMeAjKJpcgIYQcYPQ+Yo1N5CKxJbCncxgVzzrWHgLZ7ugCBHwlJXqULdtSQ9/ySxCuVtjuSgjJqCiIX4Wj3fA4VYYQ21HZtAoZTbRhJiAbgfVqIDkhxtZDibivsp6Q4IyPpT+mj3/IkBpMkRrMkhtOY4/kX4Mt1ZvM6k7EAAAAASUVORK5CYII=";
    const DEFAULT_TEXT_COLOR = "#F0F0F0";
    
    NexusGUI.addCSS(NexusGUI.q`
        .folder-header {
            text-align: center;
            background: rgba(125, 125, 125, 0.3);
            padding: 0.2em;
            border-radius: 0.4em;
            cursor: move;
        }
        ul.folder-contents {
            list-style-type: none;
            padding: 0;
            margin: 0;
            min-height: 1em;
        }
        ul.folder-contents li {
            width: 100%;
        }
        .arrow-handle {
            cursor: move;
            margin: 5px;
        }
        .deck-entry {
            width: 100%;
            transition: background 0.3s;
            cursor: pointer;
        }
        .deck-entry .engine-button {
            width: auto;
            height: auto;
            font-size: 0.8em;
            margin: 5px;
        }
        .folder-options {
            cursor: pointer;
        }
        .deck-entry:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    `);
    
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js");
    
    const postData = function (url, ...params) {
        return function (...data) {
            let obj = {};
            params.forEach((param, i) => {
                let datum = data[i];
                obj[param] = datum;
            });
            return new Promise((resolve, reject) => {
                $.post(url, obj).done(message => {
                    let json = JSON.parse(message);
                    if(json.success) {
                        resolve(json);
                    }
                    else {
                        reject(json.error || json.err || "generic error");
                    }
                });
            });
        }
    };
    
    const renameDeck = postData(
        "https://duelingnexus.com/api/rename-deck.php",
        "id", "name"
    );
    
    const createDeck = postData(
        "https://duelingnexus.com/api/create-deck.php",
        "name"
    );
    
    const deleteDeck = postData(
        "https://duelingnexus.com/api/delete-deck.php",
        "id"
    );
    
    $("#decks-container table").empty();
    
    class Folder {
        constructor(name, color = DEFAULT_TEXT_COLOR, order = Folder.orderedListing.length) {
            this.name = name;
            this.children = [];
            this.order = parseInt(order);
            this.color = color;
            this.container = $("<div>");
            this.listElement = $("<ul class=folder-contents>");
            
            this.title = $("<h1 class=folder-header>").text("[" + this.name + "]");
            
            this.updateColor();
            
            let cog = $("<img class=folder-options>").attr("src", OPTIONS_COG_BASE64).css("float", "right");
            this.title.append(cog);
            cog.click(() => {
                this.optionPrompt();
            });
            
            this.container.append(this.title);
            this.container.append(this.listElement);
            
            this.listElement.sortable({
                connectWith: ".folder-contents",
                handle: ".arrow-handle",
                items: ".deck-entry",
                update: (event, ui) => {
                    let item = ui.item;
                    item.data("deck").move(this.name);
                    this.resetChildren();
                },
            });
            
            Folder.roster[this.name] = this;
            Folder.orderedListing[order] = this;
        }
        
        updateColor() {
            this.title.css("color", this.color);
        }
        
        optionPrompt() {
            let isChanged = false;
            let table = $("<table>");
            // color tr
            let colorTr = $("<tr><td>Color</td><td><input type=color value=" + this.color + "></td></tr>");
            let colorInput = colorTr.find("input");
            let renameTr = $("<tr><td>Rename</td><td><input value=" + this.name + "></td></tr>");
            let renameInput = renameTr.find("input");
            
            $([colorInput, renameInput]).change(() => {
                isChanged = true;
                saveChangesButton.attr("disabled", false);
            });
            
            let saveChange = async () => {
                if(!isChanged) return;
                
                let newColor = colorInput.val();
                if(this.color !== newColor) {
                    this.color = newColor;
                    this.updateColor();
                }
                
                let newName = renameInput.val();
                if(this.name !== newName) {
                    // this.name = newName;
                    // TODO: update name
                }
                
                isChanged = false;
                saveChangesButton.attr("disabled", true);
                
                await exportMetaInfo();
            };
            
            let saveChangesButton = NexusGUI.button("Save Changes");
            saveChangesButton.attr("disabled", true);
            let doneButton = NexusGUI.button("Done");
            
            table.append(colorTr, renameTr);
            
            NexusGUI.popup("Options [" + this.name + "]", table);
        }
        
        attachTo(parent) {
            $(parent).append(this.container);
            return this;
        }
        
        append(child) {
            this.children.push(child);
            if(this.listElement) {
                this.listElement.append($("<li>").append(child.element));
            }
        }
        
        resetChildren() {
            this.children = this.children.filter(e => e.element);
            this.children.sort((c1, c2) =>
                (c1.displayName() > c2.displayName()) - (c1.displayName() < c2.displayName())
            );
            if(this.listElement) {
                for(let child of this.children) {
                    child.element.detach();
                    this.listElement.append($("<li>").append(child.element));
                }
            }
        }
        
        static makeFolderIfNone(name) {
            return Folder.roster[name] || new Folder(name);
        }
        
        static *allFolders() {
            yield* Folder.orderedListing;
        }
        
        infoString() {
            return `${this.name}:${this.color},${this.order}`;
        }
        
        static fromInfoString(name, string) {
            let [ color, order ] = string.split(/,/);
            return new Folder(name, color, order);
        }
    };
    Folder.roster = {};
    Folder.orderedListing = [];
    
    // initial pass: remove meta-info from deck list
    const META_INFO_REGEX = /^!! /;
    const META_INFO_ITEM_REGEX = /\s*([\S:]+?):(.+)/;
    const META_INFO_DELINEATOR = /;\s*/;
    let metaInfoCapacity = 0;
    
    const fetchDecks = async function (filterMeta = true) {
        let deckInfo = await requestJSON("https://duelingnexus.com/api/list-decks.php");
        if(!deckInfo.success) {
            NexusGUI.popup("Error retrieving decks", "Your decks are not able to be accessed at this time.");
            return null;
        }
        let decks = deckInfo.decks;
        if(filterMeta) {
            metaInfoCapacity = 0;
            while(decks[0] && META_INFO_REGEX.test(decks[0].name)) {
                let info = decks.shift().name;
                for(let item of info.split(META_INFO_DELINEATOR)) {
                    let match = item.match(META_INFO_ITEM_REGEX);
                    if(!match) {
                        console.error("Invalid item meta info: " + JSON.stringify(item), item);
                        return;
                    }
                    let [, name, value] = match;
                    Folder.fromInfoString(name, value);
                }
                metaInfoCapacity++;
            }
        }
        return decks;
    };
    
    let decks = await fetchDecks();
    
    const decksContainer = $("#decks-container");
    
    const BASE_EDITOR_URL = "https://duelingnexus.com/editor/";
    class Deck {
        constructor(info) {
            this.id = info.id;
            this.name = info.name;
            this.folder = isolateTag(this.name) || "unsorted";
            this.element = null;
            
            this.createElement();
            
            Folder.makeFolderIfNone(this.folder);
            this.move(this.folder);
        }
        
        createElement() {
            let ele = $("<div class=deck-entry><span class=arrow-handle>&#x2B24;</span><span class=deck-name></span></div>");
            
            ele.click((event) => {
                console.log(window.target = event.target);
                if(["deck-entry", "deck-name"].indexOf(target.className) !== -1) {
                    window.open(BASE_EDITOR_URL + this.id);
                }
            });
            
            let renameButton = $("<button class=engine-button>Rename</button>");
            renameButton.click(() => {
                NexusGUI.prompt("Enter a new name", this.displayName()).then((value) => {
                    if(value) {
                        this.changeName(value);
                    }
                });
            });
            let deleteButton = $("<button class=engine-button>Delete</button>");
            deleteButton.click(() => {
                NexusGUI.confirm("Are you sure you want to delete \"" + this.name + "\"?").then((confirmed) => {
                    if(confirmed) {
                        deleteDeck(this.id);
                        this.element.detach();
                        this.element = null;
                        Folder.roster[this.folder].resetChildren();
                    }
                });
            });
            
            ele.prepend(renameButton, deleteButton);
            
            this.element = ele;
            
            ele.data("deck", this);
            
            this.updateElement();
        }
        
        displayName() {
            return this.name.replace(/^\[.+?\] /, "");
        }
        
        updateElement() {
            this.element.find(".deck-name").text(this.displayName());
        }
        
        // raw rename; changes the base
        rename(newName) {
            this.name = newName;
            renameDeck(this.id, newName);
            this.updateElement();
            Folder.roster[this.folder].resetChildren();
        }
        
        // rename respecting folder
        changeName(newName) {
            this.name = newName;
            this.updateFolder();
        }
        
        updateFolder() {
            this.rename(`[${this.folder}] ${this.displayName()}`);
        }
        
        move(folderName) {
            if(this.folder !== folderName) {
                this.folder = folderName;
                this.updateFolder();
            }
            this.element.detach();
            Folder.roster[folderName].append(this);
        }
        
        static async createNew(name) {
            // TODO: hope nexus implements a better API for this.
            await createDeck(name);
            let info = fetchDecks().filter(e => e.name === name);
            if(info.length !== 1) {
                throw new Error("No such deck found: " + name);
            }
            return new Deck(info);
        }
    };
    
    // import/export 
    
    const MAX_DECK_NAME_SIZE = 64;
    const exportMetaInfo = async function () {
        let content = Folder.orderedListing.map(folder => folder.infoString());
        let lines = [];
        let build = "!! ";
        while(content.length) {
            let entry = content.pop();
            if(build.length + entry.length > MAX_DECK_NAME_SIZE) {
                if(build.length === 3) {
                    console.error("Entry exceeded max length: " + entry);
                    continue;
                }
                lines.push(build);
                build = "!! ";
            }
            build += entry + ";";
        }
        if(build) {
            lines.push(build);
        }
        
        let deficit = lines.length - metaInfoCapacity;
        
        while(deficit > 0) {
            await createDeck("!! ");
            deficit--;
        }
        let decks = await fetchDecks(false);
        
        let specifierData = decks.filter(deck => deck.name.startsWith("!! "));
        
        lines.forEach(async (line, index) => {
            line = line.slice(0, -1); // remove trailing ";"
            let spec = specifierData[index];
            await renameDeck(spec.id, line);
        });
    }
    
    for(let deck of decks) {
        let instance = new Deck(deck);
    }
    
    decksContainer.sortable({
        handle: ".folder-header",
        update: function () {
            let ordering = [...$(".folder-header")].map(header => isolateTag(header.textContent));
            ordering.forEach((name, i) => {
                let folder = Folder.roster[name];
                folder.order = i;
                Folder.orderedListing[i] = folder;
            });
            
            exportMetaInfo();
        },
    });
    
    for(let folder of Folder.orderedListing) {
        folder.attachTo(decksContainer);
    }
    
    window.Folder = Folder;
};

let deckSorterStartLoop = async function () {
    // wait until we have something to manipulate
    waitForElement("#decks-container p, #decks-container td").then((container) => {
        onStartDeckSorter();
        // now that we're here, we'll wait until we aren't
        waitForNoElement("#decks-area").then(() => {
            deckSorterStartLoop();
        });
    });
};

let startUpDeckSorter = function () {
    waitForElement("#decks-container table").then(() => {
        let sourceTable = document.querySelector("#decks-container table");
        while(sourceTable.firstChild) {
            sourceTable.removeChild(sourceTable.firstChild);
        }
        let p = document.createElement("p");
        p.appendChild(document.createTextNode("Loading UI script..."));
        sourceTable.appendChild(p);
        NexusGUI.loadScriptAsync("https://code.jquery.com/ui/1.12.1/jquery-ui.min.js").then((ev) => {
            console.info("DeckSorter.js started");
            deckSorterStartLoop();
        });
    });
};