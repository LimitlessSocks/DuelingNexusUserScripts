let onStartDeckSorter = function () {
    const MINIMIZE_SYMBOL = "\u2212";
    const MAXIMIZE_SYMBOL = "+";
    const OPTIONS_COG_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wsJBxwcoeWqgAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACn0lEQVRYw+WXO2hUQRSG/9l1o24SY1BRC40QjU1SKIIpNEVEUBRJYaekEREjWKWy0FRiFcEHiBBQLKy0EUS08AE2SbDQQlMYfIuurCYhLMndnc9most17ubuuhsQD0wznMd/nnNG+t/JVCoIXJe0U1IgKSGp3RgzsyCogT3AJ35TAJyphaF6IOm5P8uf9DpCR1OlxtcB14A+YAuQdvebgBceAD+Aw44naa3dDBwA7gGdZRm31rYAj4uUZ4BLQC9wlWgatdYeAgaAlyFw3XE9XwbcoPr0CmgP20uEL3K5XE7SWA1qN5vP59/PCyCdTgeSnkiaqKLxQNKjVCo1ETcNjTHSYIFC0bEleN8BG3y2Et7pZMyUpOEIfAVJdyV1GmOSxpikpBZJFyXlfP5IGjfGvCmnBdcDQx5PZoHTJeS6gK++CARBsBGoK2XUAN3AKeB5UZjnqADciQH+uAMapm/AeWttD9DgExwCPpTI4wzQFQNACzBSQs8UcB9YHBbMzFN002Wk8HaMuVAfLsJcFduuEJexGMASV7GRvEBrDO+XS1pZCYBWSYOSMhHRSEk6GUPnbkkdnvu8pO+SbklqM8ZMl/KiDxjz5C0L7JinfR945CaBc8CqcmbBiYji+QwcKZ5swAqgx1U3nqn4NMrOIu+rkc0m3HTz0RpJVySNAOOu4NZK2iap2dVReNVrBOqMMbNxve+ISEGlNAUcjf0WSGqX1FbFtmyQtC8WAFcox2qwD2wFdsVNwV4gF9p6vwCjEY/Nr2np9sXxkHweuFDuUnoQeAs8Awbnqt4tqJMRL+WA42kA+oGHrmsuV7oZbw+/XMBSty2H6SOw2qNjfy3+C72hEBeAmwv2nwOageFQBCrqmr/5GzZJqpsbPMaYzD/5O/4JriesdkG3NSwAAAAASUVORK5CYII=";
    const DEFAULT_TEXT_COLOR = "#F0F0F0";
    
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js");
    
    // NOTE: PROBABLY EXPENSIVE
    const domParser = new DOMParser();
    // the hackiest part of this code
    const DECK_LIST_MEMO = {};
    const getDeckList = async function (id) {
        if(DECK_LIST_MEMO[id]) {
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
        
        DECK_LIST_MEMO[id] = deck;
        
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
    
    const removeTag = function (str) {
        return str.replace(TAG_REGEX, "");
    };
    
    // TODO: find less hacky way
    const refreshDecklists = function () {
        let [ home, duelZone, deckEditor, settings ] = $("#navbar-middle button");
        return new Promise(function(resolve, reject) {
            duelZone.click();
            setTimeout(function () {
                deckEditor.click();
                resolve();
            }, 100);
        });
    };
    
    const USER_SELECTS = [
        "-webkit-touch-callout",
        "-webkit-user-select",
        "-khtml-user-select",
        "-moz-user-select",
        "-ms-user-select",
        "user-select",
    ];
    const removeSelectability = function (el) {
        USER_SELECTS.forEach(select => {
            el.style[select] = "none";
        });
    };
    // based from https://stackoverflow.com/a/30832210/4119004
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
    };
    
    let ID_LIST_MEMO;
    const loadAllDecks = async function (reload = true) {
        if(ID_LIST_MEMO && !reload) {
            return ID_LIST_MEMO;
        }
        ID_LIST_MEMO = await requestJSON("https://duelingnexus.com/api/list-decks.php");
        if(!ID_LIST_MEMO.success) {
            alert("Something went wrong getting the list of decks.");
            return;
        }
        return ID_LIST_MEMO.decks;
    };
    
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
    }
    
    const renameDeck = postData(
        "https://duelingnexus.com/api/rename-deck.php",
        "id", "name"
    );
    
    const createDeck = postData(
        "https://duelingnexus.com/api/create-deck.php",
        "name"
    );
    window.createDeck = createDeck;
    
    // const renameDeck = function (id, newName) {
        // return new Promise((resolve, reject) => {
            // $.post(, {
                // id: id,
                // name: newName,
            // }).done(msg => {
                // if(msg.success) {
                    // resolve(msg);
                // }
                // else {
                    // reject(msg.error);
                // }
            // });
        // });
    // };
    
    // const createDeck = function (name) {
        // return new Promise((resolve, reject) => {
            // $.post("https://duelingnexus.com/api/create-deck.php", {
                // name: newName,
            // }).done(msg => {
                // if(msg.success) {
                    // resolve(msg);
                // }
                // else {
                    // reject(msg.error);
                // }
            // });
        // });
    // };
    
    const toggleValue = (val, a, b) => val === a ? b : a;
    
    const sanitizeDeckName = (name) =>
        name.split(/\W+/)
            .filter(e => e !== "")
            .map(chunk => chunk.toLowerCase())
            .join("-");
    
    let deckContainer = document.getElementById("decks-container");
    let tbody = deckContainer.querySelector("tbody");
    let initialRows = [...deckContainer.querySelectorAll("tr")];
    let uniqueTags = new Set();
    let decksById = {};
    let decksByTag = {
        unsorted: [],
    };
    // give each deck its own ID
    for(let row of initialRows) {
        let tag = isolateTag(row) || "unsorted";
        let name = row.children[0].textContent;
        let obj = {
            row: row,
            name: name,
            sanitized: row.id,
            id: null,
            tag: tag,
        };
        
        row.id = sanitizeDeckName(name);
        decksById[row.id] = obj;
        decksByTag[tag] = decksByTag[tag] || [];
        decksByTag[tag].push(obj);
        uniqueTags.add(tag);
    };
    window.decksByTag=decksByTag;
    // color is an optional parameter
    const createNewTab = function (tag, color) {
        // find all rows with that tag
        let taggedRows = function () {
            // console.log(tag, decksByTag);
            return decksByTag[tag].map(e => e.row);
        }
        let tagTab = document.createElement("tr");
        removeSelectability(tagTab);
        tagTab.classList.add("tr-folder");
        
        let title = document.createElement("td");
        title.colSpan = 3;
        title.classList.add("td-big");
        title.classList.add("table-button");
        title.textContent = "[" + MINIMIZE_SYMBOL + "] " + tag;
        if(color) {
            title.style.color = color;
        }
        tagTab.appendChild(title);
        
        let saveFolder = document.createElement("td");
        saveFolder.classList.add("table-button");
        saveFolder.textContent = "Download";
        tagTab.appendChild(saveFolder);
        
        // TODO: async
        saveFolder.addEventListener("click", async function () {
            const allDecks = await loadAllDecks();
            let zip = new JSZip();
            
            let decksToDownload = allDecks.filter(deck => {
                let target = taggedRows().find(row => decksById[row.id].name === deck.name);
                if(target) {
                    decksById[target.id].id = deck.id;
                    return true;
                }
                return false;
            });
            
            for(let deckReference of decksToDownload) {
                let list = await getDeckList(deckReference.id);
                let ydk = deckToYdk(list);
                zip.file(deckReference.name + ".ydk", ydk);
            }
            
            zip.generateAsync({ type: "blob" })
            .then(function(content) {
                download(content, tag + ".zip", "application/zip");
            });
        });
        
        const toggleTaggedRows = function () {
            taggedRows().forEach(row => {
                row.style.display = toggleValue(row.style.display, "none", "table-row");
            });
            title.textContent = title.textContent.replace(/\[(.)\]/, function (match, inner) {
                return "[" + toggleValue(inner, MAXIMIZE_SYMBOL, MINIMIZE_SYMBOL) + "]";
            });
        };
        // hide by default, start the rows toggled off
        toggleTaggedRows();
        title.addEventListener("click", toggleTaggedRows);
        
        // TODO: move all tagged decks below?
        // add tagTab before first tagged row
        tbody.insertBefore(tagTab, taggedRows()[0]);
        
        taggedRows().forEach(row => {
            let textCell = row.children[0];
            textCell.style.textIndent = "2em";
        });
    };
    
    // remove specifiers from accessible list
    const SPECIFIER_REGEX = /^!! /;
    const SPECIFIER_ITEM_REGEX = /(\w+):(.+)/;
    const specifiers = {};
    const specifierRows = [];
    console.log(decksByTag);
    while(decksByTag.unsorted.length && SPECIFIER_REGEX.test(decksByTag.unsorted[0].row.textContent)) {
        let specifierRow = decksByTag.unsorted.shift().row;
        specifierRows.push(specifierRow);
        let specifierText = specifierRow.children[0].textContent;
        let items = specifierText.split(/;|\s+/);
        items.forEach(item => {
            if(/^(!!\s*)?$/.test(item)) {
                return;
            }
            let match = item.match(SPECIFIER_ITEM_REGEX);
            if(!match) {
                console.error("Invalid item specifier: " + JSON.stringify(item), item);
                return;
            }
            let [, key, value] = match;
            specifiers[key] = value;
        });
        // specifierRow.remove();
        specifierRow.style.display = "none";
    };
    
    uniqueTags.forEach(tag => {
        createNewTab(tag, specifiers[tag]);
    });
    
    const attachListeners = function () {
        let rows = [
            ...document.querySelectorAll("#decks-container tr:not(.tr-folder)")
        ];
        
        for(let row of rows) {
            let [ deckName, renameButton, copyButton, deleteButton ] = row.children;
            let oldTag = isolateTag(deckName);
            deckName.textContent = removeTag(deckName.textContent);
            copyButton.addEventListener("click", function () {
                refreshDecklists();
            });
            deleteButton.addEventListener("click", function () {
                refreshDecklists();
            });
            renameButton.addEventListener("click", function () {
                refreshDecklists();
            });
        }
        
    }
    
    attachListeners();
    
    const MAX_DECK_NAME_SIZE = 64;
    const exportSpecifiers = async function () {
        console.log("SPEC", specifiers);
        // let content = specifierRows
            // .map(tr => tr.children[0].textContent.slice(3))
            // .join(";")
            // .split(";");
        let content = Object.entries(specifiers).filter(([key, value]) =>
            value !== DEFAULT_TEXT_COLOR
        ).map(
            keyValuePair => keyValuePair.join(":")
        );
        let lines = [];
        let build = "!! ";
        while(content.length) {
            let entry = content.pop();
            if(build.length + entry.length > MAX_DECK_NAME_SIZE) {
                if(build.length === 3) {
                    console.error("Entry exceeded max length: " + entry);
                    continue;
                }
                console.log(JSON.stringify(build));
                lines.push(build);
                build = "!! ";
            }
            build += entry + ";";
        }
        if(build) {
            lines.push(build);
        }
        
        let capacity = specifierRows.length;
        let deficit = lines.length - capacity;
        if(deficit > 0) {
            console.warn("Creating new decks to make up for deficit of " + deficit);
            console.log({ capacity : capacity, deficit: deficit });
        }
        while(deficit > 0) {
            await createDeck("!! ");
            deficit--;
        }
        let decks = await loadAllDecks();
        
        let specifierData = decks.filter(deck => deck.name.startsWith("!! "));
        
        lines.forEach(async (line, index) => {
            line = line.slice(0, -1); // remove trailing ";"
            let spec = specifierData[index];
            console.log("renaming!", {
                from: spec.id,
                to: line,
            });
            await renameDeck(spec.id, line);
        });
        console.log(content);
    }
    
    // add new button to top
    let options = $("<button data-v-6f705b54=''>Options</button>");
    let createNewDeck = $("#decks-buttons button")[0];
    createNewDeck.addEventListener("click", function () {
        refreshDecklists();
    });
    options.insertAfter(createNewDeck);
    $("#decks-buttons").css("justify-content", "start")
                       .css("-webkit-box-pack", "start")
                       .css("display", "flex");
    let optionsCog = $("<img data-v-6f705b54=''>").attr("src", OPTIONS_COG_BASE64);
    options.prepend(optionsCog);
    options.click(function () {
        let content = "";//specifierRows
        // TODO: flex stuff
        console.log(specifierRows);
        let sorted = [...uniqueTags].sort();
        let table = $("<table>");
        for(let tag of sorted) {
            specifiers[tag] = specifiers[tag] || DEFAULT_TEXT_COLOR;
            let color = toHexString(specifiers[tag]);
            let tr = $("<tr><td>" + tag + "</td><td><input type=color value=" + color + "></td></tr>");
            table.append(tr);
            let input = tr.find("input");
            input.on("change", async function (val) {
                specifiers[tag] = input.val();
                await exportSpecifiers();
                setTimeout(refreshDecklists, 200);
            });
        }
        NexusGUI.popup("Modify Colors", table);
    });
};

let startUpDeckSorter = async function () {
    // wait until we have something to manipulate
    waitForElement("#decks-container td").then((container) => {
        console.log("Received: ", container.parentNode.parentNode.children);
        onStartDeckSorter();
        // now that we're here, we'll wait until we aren't
        waitForNoElement("#decks-area").then(() => {
            startUpDeckSorter();
        });
    });
};