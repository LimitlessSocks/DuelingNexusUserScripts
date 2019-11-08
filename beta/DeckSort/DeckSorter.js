let onStartDeckSorter = function () {
    const MINIMIZE_SYMBOL = "\u2212";
    const MAXIMIZE_SYMBOL = "+";
    
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
    
    const removeFrom = (arr, val) => arr.splice(arr.indexOf(val), 1);
    
    let ID_LIST_MEMO;
    const loadAllDecks = async function () {
        // if(ID_LIST_MEMO) {
            // return ID_LIST_MEMO;
        // }
        ID_LIST_MEMO = requestJSON("https://duelingnexus.com/api/list-decks.php");
        if(!ID_LIST_MEMO.success) {
            alert("Something went wrong getting the list of decks.");
            return;
        }
        return ID_LIST_MEMO.decks;
    };
    
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
    let decksByTag = {};
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
    
    // color is an optional parameter
    const createNewTab = function (tag, color) {
        // find all rows with that tag
        let taggedRows = function () {
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
    const SPECIFIER_REGEX = /^!!/;
    const SPECIFIER_ITEM_REGEX = /(\w+):(.+)/;
    const specifiers = {};
    console.log(decksByTag);
    while(decksByTag.unsorted.length && SPECIFIER_REGEX.test(decksByTag.unsorted[0].row.textContent)) {
        // TODO: find analogue, since we're using sets now
        let specifierRow = decksByTag.unsorted.shift().row;
        let specifierText = specifierRow.children[0].textContent;
        let items = specifierText.split(/;|\s+/);
        items.forEach(item => {
            if(item === "!!") {
                return;
            }
            let match = item.match(SPECIFIER_ITEM_REGEX);
            if(!match) {
                console.error("Invalid item specifier: " + item);
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
            let [deckName, renameButton, copyButton, deleteButton] = row.children;
            let oldTag = isolateTag(deckName);
            deckName.textContent = removeTag(deckName.textContent);
            // broken rn
            renameButton.addEventListener("click", function () {
                // alert("NEW DECK!", deckName.textContent);
                let newTag = isolateTag(deckName);
                if(newTag === oldTag) {
                    return;
                }
                let deckObject = decksById[this.id];
                removeFrom(decksByTag[oldTag], deckObject);
                if(!uniqueTags.has(newTag)) {
                    createNewTab(newTag, specifiers[newTag]);
                    decksByTag[newTag] = [];
                }
                decksByTag[newTag].push(deckObject);
            });
        }
        
    }
    
    attachListeners();
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