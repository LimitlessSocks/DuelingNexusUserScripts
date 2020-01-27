// ==UserScript==
// @name         CustomNexusGUI API
// @namespace    https://duelingnexus.com/
// @version      0.7
// @description  To enable custom GUI elements, such as popups.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/*
// @updateURL   https://raw.githubusercontent.com/LimitlessSocks/DuelingNexusUserScripts/master/beta/CustomNexusGUI/CustomNexusGUI.user.js
// @downloadURL https://raw.githubusercontent.com/LimitlessSocks/DuelingNexusUserScripts/master/beta/CustomNexusGUI/CustomNexusGUI.user.js
// ==/UserScript==

const MY_VERSION = GM_info.script.version;

// modified from https://stackoverflow.com/a/16187766/4119004
const simplifyVersion = (ver) => ver.replace(/(\.0)+$/, "");
const versionSplit = (ver) => simplifyVersion(ver).split(".");
const versionCompare = (ver1, ver2) => {
    let segment1 = versionSplit(ver1);
    let segment2 = versionSplit(ver2);
    let size = Math.min(segment1.length, segment2.length);
    
    let diff;
    for(let i = 0; i < size; i++) {
        diff = parseInt(segment1[i]) - parseInt(segment2[i]);
        if(diff) {
            return diff;
        }
    }
    return segment1.length - segment2.length;
};

const NexusGUI = {
    // loaded: false,
    version: MY_VERSION,
    commonCSS: null,
    addCSS: function (css, makeNew = false) {
        if(makeNew) {
            $("head").append($("<style>").text(css));
        }
        else {
            if(!NexusGUI.commonCSS) {
                NexusGUI.commonCSS = $("<style id='nexus-gui-common-css'>");
                $("head").append(NexusGUI.commonCSS);
            }
            NexusGUI.commonCSS.append(css);
        }
    },
    _popupElements: {
        background: null,
        title: null,
        content: null,
    },
    _popupElementsLoaded: false,
    loadPopupElements: function (overwrite = true) {
        // reference variable
        const elements = NexusGUI._popupElements;
        
        if(NexusGUI._popupElementsLoaded && !overwrite) {
            return true;
        }
        for(let val of Object.values(elements)) {
            if(val) {
                val.remove();
            }
        }
        
        elements.popupWrapper = $("<div id='nexus-gui-popup-wrapper'><div id='nexus-gui-popup-background'></div><div id='nexus-gui-popup'><h2 id='nexus-gui-popup-title'></h2><div id='nexus-gui-popup-content'>WOOOOO</div></div></div>");
        elements.popup = elements.popupWrapper.find("#nexus-gui-popup");
        elements.background = elements.popupWrapper.find("#nexus-gui-popup-background");
        elements.title = elements.popupWrapper.find("#nexus-gui-popup-title");
        elements.content = elements.popupWrapper.find("#nexus-gui-popup-content");
        
        elements.background.click(function () {
            elements.popupWrapper.toggle(false);
        });
        elements.popupWrapper.toggle(false);
        
        $("body").append(elements.popupWrapper);
        
        NexusGUI._popupElementsLoaded = true;
    },
    _popupStyles: ["wide", "minimal"],
    popup: function (title, content, options = {}) {
        // reference variable
        const elements = NexusGUI._popupElements;
        
        NexusGUI.loadPopupElements();
        elements.popupWrapper.toggle(true);
        elements.title.text(title);
        elements.content.empty();
        elements.content.append(content);
        
        elements.popup.removeClass(...NexusGUI._popupStyles);
        
        if(NexusGUI._popupStyles.indexOf(options.style) !== -1) {
            elements.popup.addClass(options.style);
        }
        else if(options.style) {
            console.warn("No such style `" + options.style + "`, ignoring");
        }
        
        return new Promise((resolve, reject) => {
            let cleanUp = () => {
                resolve();
                elements.background.unbind("click", cleanUp);
            };
            
            elements.background.bind("click", cleanUp);
        });
    },
    closePopup: function () {
        const elements = NexusGUI._popupElements;
        elements.background.trigger("click");
    },
    button: (text) => $("<button>").addClass("nexus-gui-button").text(text),
    prompt: function (message, defaultValue = null) {
        let content = $("<div>");
        let input = $("<input type=text>");
        if(defaultValue !== null) {
            input.val(defaultValue);
        }
        content.append(input);
        let okButton = NexusGUI.button("OK");
        let cancelButton = NexusGUI.button("Cancel");
        content.append($("<div>").append(okButton, cancelButton));
        return new Promise((resolve, reject) => {
            okButton.click(() => {
                resolve(input.val());
                NexusGUI.closePopup();
            });
            input.keyup((event) => {
                if(event.which === 13) {
                    resolve(input.val());
                    NexusGUI.closePopup();
                }
            });
            cancelButton.click(() => {
                resolve(null);
                NexusGUI.closePopup();
            });
            NexusGUI.popup(message, content, { style: "minimal" }).then(() => {
                resolve(null);
            });
            input.focus();
        });
    },
    dropdown: function (message, options) {
        let content = $("<div>");
        let select = $("<select>");
        let okButton = NexusGUI.button("OK");
        let cancelButton = NexusGUI.button("Cancel");
        for(let option of options) {
            select.append($("<option>").val(option).text(option));
        }
        content.append(
            select,
            $("<div>").append(okButton, cancelButton)
        );
        return new Promise((resolve, reject) => {
            okButton.click(() => {
                resolve(select.val());
                NexusGUI.closePopup();
            });
            cancelButton.click(() => {
                resolve(null);
                NexusGUI.closePopup();
            });
            NexusGUI.popup(message, content, { style: "minimal" }).then(() => {
                resolve(null);
            });
            select.focus();
        });
    },
    confirm: function (title, useCancel = false) {
        let content = $("<div>");
        let yes = NexusGUI.button("Yes");
        let no = NexusGUI.button("No");
        let cancel = NexusGUI.button("Cancel");
        content.append(yes, no);
        no.focus();
        if(useCancel) {
            content.append(cancel);
            cancel.focus();
        }
        return new Promise((resolve, reject) => {
            yes.click(() => {
                resolve(true);
                NexusGUI.closePopup();
            });
            no.click(() => {
                resolve(false);
                NexusGUI.closePopup();
            });
            cancel.click(() => {
                resolve(null);
                NexusGUI.closePopup();
            });
            NexusGUI.popup(title, content, { style: "minimal" }).then(() => {
                resolve(null);
            });
        });
    },
    q: function (strings, ...subs) {
        let total = strings.raw.map((string, i) => 
            string + (i in subs ? subs[i] : "")
        ).join("");
        // universalize tabs
        total = total.replace(/\t/g, "    ");
        // remove leading indentation
        let lines = total.split(/\r?\n/);
        let indentSizes = lines
            .filter(e => e.length !== 0)
            .map(e => e.match(/^\s*/)[0].length);
        let minSize = Math.min(...indentSizes);
        let reg = new RegExp("^\\s{" + minSize + "}");
        return lines
            .map(line => line.replace(reg, ""))
            .join("\n");
    },
    paginatedPopup: function (title, pages) {
        let content = $("<div>");
        let current = $("<p>");
        let previousPage = NexusGUI.button("<");
        let pagePreview = $("<span></span>");
        let nextPage = NexusGUI.button(">");
        let currentPage = 0;
        let update = () => {
            if(currentPage < 0) {
                currentPage = 0;
            }
            if(currentPage >= pages.length) {
                currentPage = pages.length - 1;
            }
            previousPage.attr("disabled", currentPage === 0);
            nextPage.attr("disabled", currentPage === pages.length - 1);
            
            pagePreview.text((currentPage + 1) + " / " + pages.length);
            
            current.text(pages[currentPage]);
        };
        
        update();
        
        nextPage.click(() => {
            currentPage++;
            update();
        });
        
        previousPage.click(() => {
            currentPage--;
            update();
        });
        
        let pageContainer = $("<div class=nexus-gui-page-container>");
        pageContainer.append(previousPage, pagePreview, nextPage);
        
        content.append(current);
        content.append(pageContainer);
        
        return NexusGUI.popup(title, content);
    },
    loadScript: function (url, cb = null) {
        let script = document.createElement("script");
        script.src = url;
        if (cb) {
            script.addEventListener("load", cb);
        }
        document.head.appendChild(script);
    },
    loadScriptAsync: async function (url) {
        return new Promise((resolve, reject) => {
            let script = document.createElement("script");
            script.src = url;
            script.addEventListener("load", resolve);
            document.head.appendChild(script);
        });
    },
    formatGithubURL: (name, release, path) => `https://github.com/${path}/raw/master/${release}/${name}/${name}.user.js`,
    loadUserScript: function (
        name,
        release = "final",
        path = "LimitlessSocks/DuelingNexusUserScripts"
    ) {
        let url = NexusGUI.formatGithubURL(name, release, path);
        NexusGUI.loadScript(url);
    },
};

let onLoad = function () {
    NexusGUI.addCSS(NexusGUI.q`
        .nexus-gui-page-container {
            position: absolute;
            bottom: 0.5em;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        /* mostly a copy of engine-button */
        .nexus-gui-button {
            background-color: rgba(0,0,0,0.8);
            color: #f0f0f0;
            font-family: "Helvetica Neue", Helvetica, Verdana, Geneva, sans-serif;
            font-size: 14px;
            border: 1px solid #f0f0f0;
            min-height: 32px;
            padding-left: 8px;
            padding-right: 8px;
            margin: 5px;
            cursor: pointer;
        }
        .nexus-gui-button:hover {
            background-color: rgba(64, 64, 64);
            background-color: rgba(64, 64, 64, 0.8);
        }
        .nexus-gui-button:disabled,
        .nexus-gui-button[disabled] {
            cursor: not-allowed;
            background: rgba(90, 64, 64, 0.8);
        }
        #nexus-gui-popup-background {
            z-index: 100000;
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background: rgb(0, 0, 0);
            background: rgba(0, 0, 0, 0.5);
        }
        #nexus-gui-popup {
            z-index: 100001;
            background: rgba(0, 0, 0, .9);
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            min-height: 300px;
            width: 480px;
            padding: 0.5em;
            text-align: center;
            border: 1px solid #7A7A7A;
            max-height: 90%;
            overflow: auto;
        }
        #nexus-gui-popup.wide {
            width: 800px;
        }
        #nexus-gui-popup.minimal {
            width: auto;
            min-height: 0px;
            height: auto;
        }
        #nexus-gui-popup-title {
            margin: 0;
            margin-bottom: 0.2em;
            border-bottom: 1px #7A7A7A;
        }
        .nexus-gui-danger-button {
            background: rgba(255, 107, 107, 0.8);
        }
    `);
}
let versionDifference = null;
if(window.NexusGUI) {
    versionDifference = versionCompare(MY_VERSION, window.NexusGUI.version);
    if(versionDifference < 0) {
        // do not update myself if I'm older
        console.warn("This script version (" + MY_VERSION + ") is outdated, and was not loaded because a newer version was loaded already.");
        return;
    }
    else if(versionDifference === 0) {
        console.info("Script version " + MY_VERSION + " has already been loaded.");
        return;
    }
}

window.NexusGUI = NexusGUI;
console.info("CustomNexusGUI API loaded! Version = " + MY_VERSION);
if(!window.$) {
    // the same used by nexus
    console.info("Hard loading jQuery");
    const jQueryInstallationURL = "https://code.jquery.com/jquery-3.1.1.min.js";
    NexusGUI.loadScriptAsync(jQueryInstallationURL).then(onLoad);
}
else {
    onLoad();
}
