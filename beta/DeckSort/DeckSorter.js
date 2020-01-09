let onStartDeckSorter = async function () {
    const MINIMIZE_SYMBOL = "\u2212";
    const MAXIMIZE_SYMBOL = "+";
    const OPTIONS_COG_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wsJBxwcoeWqgAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACn0lEQVRYw+WXO2hUQRSG/9l1o24SY1BRC40QjU1SKIIpNEVEUBRJYaekEREjWKWy0FRiFcEHiBBQLKy0EUS08AE2SbDQQlMYfIuurCYhLMndnc9most17ubuuhsQD0wznMd/nnNG+t/JVCoIXJe0U1IgKSGp3RgzsyCogT3AJ35TAJyphaF6IOm5P8uf9DpCR1OlxtcB14A+YAuQdvebgBceAD+Aw44naa3dDBwA7gGdZRm31rYAj4uUZ4BLQC9wlWgatdYeAgaAlyFw3XE9XwbcoPr0CmgP20uEL3K5XE7SWA1qN5vP59/PCyCdTgeSnkiaqKLxQNKjVCo1ETcNjTHSYIFC0bEleN8BG3y2Et7pZMyUpOEIfAVJdyV1GmOSxpikpBZJFyXlfP5IGjfGvCmnBdcDQx5PZoHTJeS6gK++CARBsBGoK2XUAN3AKeB5UZjnqADciQH+uAMapm/AeWttD9DgExwCPpTI4wzQFQNACzBSQs8UcB9YHBbMzFN002Wk8HaMuVAfLsJcFduuEJexGMASV7GRvEBrDO+XS1pZCYBWSYOSMhHRSEk6GUPnbkkdnvu8pO+SbklqM8ZMl/KiDxjz5C0L7JinfR945CaBc8CqcmbBiYji+QwcKZ5swAqgx1U3nqn4NMrOIu+rkc0m3HTz0RpJVySNAOOu4NZK2iap2dVReNVrBOqMMbNxve+ISEGlNAUcjf0WSGqX1FbFtmyQtC8WAFcox2qwD2wFdsVNwV4gF9p6vwCjEY/Nr2np9sXxkHweuFDuUnoQeAs8Awbnqt4tqJMRL+WA42kA+oGHrmsuV7oZbw+/XMBSty2H6SOw2qNjfy3+C72hEBeAmwv2nwOageFQBCrqmr/5GzZJqpsbPMaYzD/5O/4JriesdkG3NSwAAAAASUVORK5CYII=";
    const MOVE_ARROWS_BASE64 = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AEGBwAAXEWT3QAAAOtJREFUWMPtl8sRhCAQRKm9r1lJPKsRGILZaQBiGL69YC2lDvhhlQN9ZIBp5tPFKHUBQAM06glY5zOaJ53fS0Jwfg+JgPP/kgBa9qNVGRlXCy5gr4HeKboeqK/cuWo1wVYAxlP9BiiEs+EWdftcsBtgAkZAO+ulYzMeAjKJpcgIYQcYPQ+Yo1N5CKxJbCncxgVzzrWHgLZ7ugCBHwlJXqULdtSQ9/ySxCuVtjuSgjJqCiIX4Wj3fA4VYYQ21HZtAoZTbRhJiAbgfVqIDkhxtZDibivsp6Q4IyPpT+mj3/IkBpMkRrMkhtOY4/kX4Mt1ZvM6k7EAAAAASUVORK5CYII=";
    const DOWNLOAD_BASE64 = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AEIFScBDvoRAwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACAElEQVR42u2bPWsUURSGn7ObWESICCKICFpbCQoRrK0sRGxsrZSgKIr/QouAleAf0EYQf4CI4hchhWgjmlYbPwIaXPexSbFFDLs7M7szO+dtZ+bOeZ87c+89585AKpVqs6KqhtVdwDJwaNzYIuJ6Y8mqu9VVC2gScXYqbr9X947qtH0MSAAJIAEkgASQABJAAkgACSABJIAEkAASQAJIAAkgAZSmv4B1BzA37oXqPuAa8IPt9xfmgQNFglNvAt3/HO4CTyPiWZF7RMEAHwDnp9R5XyNi/7RfgWVgfQrmN4CTUx8DIuILcGEKAG5FxMfaDCTqVSenx7UcTdWHEzD/Wp0rM+4oEcBe4BOwpyLG34BTEfGutnOqelztVdT7lxuxslIvVmD+dmOWlmpHfVKi+VfqfKPW11sfR6yXYL6vHm1kkqEeVjcLAjjb6ExLvVLA/J2ZSDfVR2OYf68uzEzOrX4Ywfxv9chMFR3UY+rGkABOz2TlRb0xhPm7ajCrUu/tYH516+NKZhnAovpmG/Pf1UXaIPWE+mvAfE89Q5uknhsAsEIbpa6ob2mr1IWyixuVFkTUg8AloF8Wg7KLMgPtfY6I+2UDWAJeNOQBexkRS8OcOEpVuN+gN2xz2BNzbzABtFyjTEM/gefU/zeYLrBWxTQYQFOSlX5E/CGVSqVSO+sf+llnjMZl7WMAAAAASUVORK5CYII=";
    const DOWN_CHEVRON_BASE64 = " data:image/png;base64,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";
    const UP_CHEVRON_BASE64 = " data:image/png;base64,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";
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
        #decks-buttons button {
            width: auto;
        }
        .folder-header img {
            cursor: pointer;
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
    
    // name is the newName
    const copyDeck = postData(
        "https://duelingnexus.com/api/copy-deck.php",
        "id", "name"
    );
    
    const deleteDeck = postData(
        "https://duelingnexus.com/api/delete-deck.php",
        "id"
    );
    
    $("#decks-container table").empty();
    
    const generateDifferentName = (base, set) => {
        let count = 1;
        let builtName;
        do {
            builtName = `${base} (${count})`;
            count++;
        } while (set.has(builtName));
        return builtName;
    };
    
    // the hackiest part of this code
    const domParser = new DOMParser();
    const DECK_LIST_MEMO = {};
    DeckSort.useListMemo = false;
    const getDeckList = async function (id) {
        if(DeckSort.useListMemo && DECK_LIST_MEMO[id]) {
            return DECK_LIST_MEMO[id];
        };

        let content = await requestText("https://duelingnexus.com/editor/" + id);
        let tree = domParser.parseFromString(content, "text/html");
        let deckScripts = [
            ...tree.querySelectorAll("script")
        ].filter(e => e.textContent.indexOf("Deck") !== -1);
        if(deckScripts.length !== 1) {
            throw new Error("Please notify the maintainer. Unexpected number of deck scripts: " + deckScripts.length);
        }
        let deckLoadingScript = deckScripts[0].textContent;
        let deck = eval("(function() { " + deckLoadingScript + "; return Deck; })()");

        if(DeckSort.useListMemo) {
            DECK_LIST_MEMO[id] = deck;
        }
        
        return deck;
    };

    const deckToYdk = function (deck) {
        let lines = [
            "#created by RefinedSearch plugin"
        ];
        for(let kind of ["main", "extra", "side"]) {
            let header = (kind === "side" ? "!" : "#") + kind;
            lines.push(header);
            lines.push(...deck[kind]);
        }
        let message = lines.join("\n");
        return message;
    };
    
    class Folder {
        constructor(name, color = DEFAULT_TEXT_COLOR, order = Folder.orderedListing.length) {
            this.name = name;
            this.children = [];
            this.order = parseInt(order);
            this.color = color;
            this.container = $("<div>");
            this.listElement = $("<ul class=folder-contents>");
            
            this.title = $("<h1 class=folder-header><span class=folder-name></span></h1>");
            
            this.updateVisuals();
            
            let cog = $("<img class=folder-options>")
                .attr("src", OPTIONS_COG_BASE64)
                .css("float", "right");
            this.title.append(cog);
            cog.click(() => {
                this.optionPrompt();
            });
            
            let folderDownload = $("<img class=folder-download>")
                .attr("src", DOWNLOAD_BASE64)
                .css("float", "right")
                .attr("height", "32");
            this.title.append(folderDownload);
            folderDownload.click(async () => {
                let zip = new JSZip();
                for(let deck of this.children) {
                    let list = await getDeckList(deck.id);
                    let ydk = deckToYdk(list);
                    zip.file(deck.name + ".ydk", ydk);
                }
                zip.generateAsync({ type: "blob" }).then((content) => {
                    download(content, "dnexus-folder-" + this.name + ".zip", "application/zip");
                });
            });
            
            this.collapse = $("<img class=folder-collapse>")
                .css("float", "left")
                .attr("height", "32");
            
            let updateVisuals = (nowCollapsed) => {
                if(nowCollapsed) {
                    this.collapse.attr("src", UP_CHEVRON_BASE64);
                }
                else {
                    this.collapse.attr("src", DOWN_CHEVRON_BASE64);
                }
                for(let child of this.children) {
                    child.element.toggle(!nowCollapsed);
                }
                this.listElement.css("min-height", nowCollapsed ? "0" : "");
            };
            let toggleHidden = () => {
                let nowCollapsed = !this.collapse.data("collapsed");
                this.collapse.data("collapsed", nowCollapsed);
                updateVisuals(nowCollapsed);
                updateVisuals(nowCollapsed);
            };
            this.collapse.click(toggleHidden);
            
            this.collapse.data("collapsed", false);
            updateVisuals(this.collapse.data("collapsed"));
            
            this.title.append(this.collapse);
            
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
        
        updateVisuals() {
            this.title.css("color", this.color);
            this.title.find(".folder-name").text("[" + this.name + "]");
        }
        
        changeName(newName) {
            delete Folder.roster[this.name];
            this.name = newName;
            Folder.roster[this.name] = this;
            
            
            for(let child of this.children) {
                child.folder = newName;
                child.updateFolder();
            }
            
            exportMetaInfo();
        }
        
        optionPrompt() {
            let isChanged = false;
            let content = $("<div>");
            let table = $("<table>");
            // color tr
            let colorTr = $("<tr><td>Color</td><td><input type=color></td></tr>");
            let colorInput = colorTr.find("input");
            colorInput.val(this.color);
            let renameTr = $("<tr><td>Rename</td><td><input type=text></td></tr>");
            let renameInput = renameTr.find("input");
            renameInput.val(this.name);
            
            let updateButton = () => {
                isChanged = true;
                saveChangesButton.attr("disabled", false);
            };
            colorInput.change(updateButton);
            renameInput.change(updateButton);
            
            let saveChanges = async () => {
                if(!isChanged) return;
                
                let newColor = colorInput.val();
                if(this.color !== newColor) {
                    this.color = newColor;
                }
                
                let newName = renameInput.val();
                if(this.name !== newName) {
                    this.changeName(newName);
                }
                
                this.updateVisuals();
                
                isChanged = false;
                saveChangesButton.attr("disabled", true);
                
                await exportMetaInfo();
            };
            
            let deleteTr = $("<tr><td colspan=2></td></tr>");
            let deleteButton = NexusGUI.button("Delete");
            deleteButton.addClass("nexus-gui-danger-button");
            deleteTr.find("td").append(deleteButton);
            
            deleteButton.click(() => {
                NexusGUI.confirm("Are you sure you want to delete folder \"" + this.name + "\"?").then(() => {
                    this.destroy();
                });
            });
            
            let saveChangesButton = NexusGUI.button("Save Changes");
            saveChangesButton.attr("disabled", true);
            saveChangesButton.click(saveChanges);
            let doneButton = NexusGUI.button("Done");
            doneButton.click(async () => {
                await saveChanges();
                NexusGUI.closePopup();
            });
            
            table.append(colorTr);
            
            if(this.name !== "unsorted") {
                table.append(renameTr, deleteTr);
            }
            
            content.append(table, saveChangesButton, doneButton);
            
            NexusGUI.popup("Options [" + this.name + "]", content);
        }
        
        attachTo(parent) {
            $(parent).append(this.container);
            return this;
        }
        
        append(child) {
            this.children.push(child);
            if(this.listElement) {
                child.element.toggle(!this.collapse.data("collapsed"));
                this.listElement.append($("<li>").append(child.element));
            }
        }
        
        remove(child) {
            let index;
            while((index = this.children.indexOf(child)) !== -1) {
                this.children.splice(index, 1);
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
        
        destroy() {
            for(let child of this.children.slice()) {
                child.move("unsorted");
            }
            this.container.detach();
            Folder.orderedListing.splice(this.order, 1);
            for(let i = this.order; i < Folder.orderedListing.length; i++) {
                Folder.orderedListing[i].order--;
            }
            delete Folder.roster[this.name];
            exportMetaInfo();
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
    
    DeckSort.Folder = Folder;
    
    // initial pass: remove meta-info from deck list
    const META_INFO_REGEX = /^!! /;
    const META_INFO_ITEM_REGEX = /\s*(\w[^:]*?):(.+)/;
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
    DeckSort.fetchDecks = fetchDecks;
    
    let decks = await fetchDecks();
    
    const decksContainer = $("#decks-container");
    
    const BASE_EDITOR_URL = "https://duelingnexus.com/editor/";
    class Deck {
        constructor(info) {
            this.id = info.id;
            this.name = info.name;
            Deck.usedNames.add(this.name);
            this.folder = isolateTag(this.name) || "unsorted";
            this.element = null;
            
            this.createElement();
            
            Folder.makeFolderIfNone(this.folder);
            this.move(this.folder);
        }
        
        createElement() {
            let ele = $("<div class=deck-entry><span class=arrow-handle>&#x2B24;</span><span class=deck-name></span></div>");
            
            ele.click((event) => {
                if(["deck-entry", "deck-name"].indexOf(event.target.className) !== -1) {
                    window.open(BASE_EDITOR_URL + this.id);
                }
            });
            
            let renameButton = $("<button class=engine-button>Rename</button>");
            renameButton.click(() => {
                NexusGUI.prompt("Enter a new name", this.displayName()).then((value) => {
                    if(value) {
                        if(Folder.roster[value]) {
                            let keySet = new Set(Object.keys(Folder.roster));
                            value = generateDifferentName(value, keySet);
                        }
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
            let copyButton = $("<button class=engine-button>Clone</button>");
            copyButton.click(() => {
                NexusGUI.prompt("Enter a name for the clone", this.displayName()).then((value) => {
                    if(value) {
                        // TODO: dry this
                        if(Folder.roster[value]) {
                            let keySet = new Set(Object.keys(Folder.roster));
                            value = generateDifferentName(value, keySet);
                        }
                        this.cloneTo(value);
                    }
                });
            });
            
            ele.prepend(renameButton, copyButton, deleteButton);
            
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
                Folder.roster[this.folder].remove(this);
                this.folder = folderName;
                this.updateFolder();
            }
            this.element.detach();
            Folder.roster[folderName].append(this);
        }
        
        static async reloadInfoByName(name) {
            let decks = await fetchDecks(false);
            let info = decks.filter(e => e.name === name);
            if(info.length !== 1) {
                throw new Error("No such deck found: " + name);
            }
            return info[0];
        }
        
        static async createNew(name) {
            // TODO: hope nexus implements a better API for this.
            await createDeck(name);
            let info = await Deck.reloadInfoByName(name);
            return new Deck(info);
        }
        
        async cloneTo(newName) {
            // add folder
            newName = "[" + this.folder + "] " + newName;
            await copyDeck(this.id, newName);
            let info = await Deck.reloadInfoByName(newName);
            console.log(info);
            return new Deck(info);
        }
    };
    Deck.usedNames = new Set([]);
    DeckSort.Deck = Deck;
    
    // import/export 
    
    const MAX_DECK_NAME_SIZE = 64;
    let isExporting = false;
    const exportMetaInfo = async function () {
        if(isExporting) {
            return false;
        }
        isExporting = true;
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
        if(build && build !== "!! ") {
            lines.push(build);
        }
        
        let deficit = lines.length - metaInfoCapacity;
        
        while(deficit > 0) {
            await createDeck("!! ");
            deficit--;
        }
        let decks = await fetchDecks(false);
        
        let specifierData = decks.filter(deck => deck.name.startsWith("!! ") && deck.name !== "!! ");
        
        let index = 0;
        for(let line of lines) {
            line = line.slice(0, -1); // remove trailing ";"
            let spec = specifierData[index];
            await renameDeck(spec.id, line);
            index++;
        }
        
        isExporting = false;
        return true;
    }
    DeckSort.exportMetaInfo = exportMetaInfo;
    
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
    
    Folder.makeFolderIfNone("unsorted");
    
    for(let folder of Folder.orderedListing) {
        folder.attachTo(decksContainer);
    }
    
    let oldCreateNewDeck = $($("#decks-buttons button")[0]);
    let createNewDeck = oldCreateNewDeck.clone();
    oldCreateNewDeck.replaceWith(createNewDeck);
    createNewDeck.click(() => {
        NexusGUI.prompt("Please enter new deck name").then(async (name) => {
            if(!name) {
                return;
            }
            
            if(name.length < 3) {
                NexusGUI.closePopup();
                NexusGUI.popup("Error", "Your deck's name must be at least 3 characters.", { style: "minimal" } );
            }
            
            if(Deck.usedNames.has(name)) {
                name = generateDifferentName(name, Deck.usedNames);
            }
            
            Deck.createNew(name);
        });
    });
    
    let newFolder = $("<button>New Folder</button>");
    newFolder.insertAfter(createNewDeck);
    newFolder.click(function () {
        NexusGUI.prompt("Please enter folder name").then(async (name) => {
            if(name) {
                if(Folder.roster[name]) {
                    let keySet = new Set(Object.keys(Folder.roster));
                    name = generateDifferentName(name, keySet);
                }
                new Folder(name).attachTo(decksContainer);
                exportMetaInfo();
            }
        });
    });
    
    let collapseAll = $("<button>Collapse All</button>");
    collapseAll.insertAfter(newFolder);
    collapseAll.click(function () {
        for(let toggle of $(".folder-collapse")) {
            if(!$(toggle).data("collapsed")) {
                toggle.click();
            }
        }
    });
    
    $("#decks-buttons").css("justify-content", "start")
                       .css("-webkit-box-pack", "start")
                       .css("display", "flex");
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