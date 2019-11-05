// ==UserScript==
// @name         CustomNexusGUI API
// @namespace    https://duelingnexus.com/
// @version      0.1
// @description  To enable custom GUI elements, such as popups.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/*
// ==/UserScript==

const NexusGUI = {
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
    _popupStyles: ["wide"],
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
    loadScript: function (url, cb = null) {
        let script = document.createElement("script");
        script.src = url;
        if (cb) {
            script.addEventListener("load", cb);
        }
        document.head.appendChild(script);
    },
    formatGithubURL: (name, release, path) => `https://github.com/${path}/raw/master/${release}/${name}/${name}.user.js`,
    loadUserScript: function (
        name,
        release = "final",
        path = "LimitlessSocks/DuelingNexusUserScripts"
    ) {
        let url = NexusGUI.formatGithubURL(name, release, path);
        NexusGUI.loadScript(url);
    }
};

let onLoad = function () {
    NexusGUI.addCSS(NexusGUI.q`
        #nexus-gui-popup-background {
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background: rgb(0, 0, 0);
            background: rgba(0, 0, 0, 0.5);
        }
        #nexus-gui-popup {
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
        }
        #nexus-gui-popup.wide {
            width: 800px;
        }
        #nexus-gui-popup-title {
            margin: 0;
            margin-bottom: 0.2em;
            border-bottom: 1px #7A7A7A;
        }
    `);
    console.info("CustomNexusGUI API loaded!");
}
if(!window.jQuery) {
    // the same used by nexus
    const jQueryInstallationURL = "https://code.jquery.com/jquery-3.1.1.min.js";
    NexusGUI.loadScript(jQueryInstallationURL, onLoad);
}
else {
    onLoad();
}
window.NexusGUI = NexusGUI;