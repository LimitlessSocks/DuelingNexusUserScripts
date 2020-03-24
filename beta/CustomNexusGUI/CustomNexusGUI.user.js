// ==UserScript==
// @name         CustomNexusGUI API
// @namespace    https://duelingnexus.com/
// @version      0.11
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

class NexusForm {
    constructor() {
        this.elements = [];
        this.content = null;
    }
    
    add(...formElements) {
        this.elements.push(...formElements);
    }
    
    popup(title = "Form") {
        return new Promise((resolve, reject) => {
            let content = $("<div>");
            let promises = [];
            
            for(let el of this.elements) {
                let { promise, element } = el.info();
                if(promise) {
                    promises.push(promise);
                }
                content.append(element);
            }
            
            this.content = content;
            NexusGUI.popup(title, content).then(() => {
                resolve();
            });
            
            // console.log("THONK", promises);
            if(promises.length === 0) {
                // resolve();
                return;
            }
            Promise.race(promises.flat()).then((...values) => {
                resolve(...values);
                NexusGUI.closePopup();
            });
        });
    }
}

class NexusFormElement {
    constructor(name) {
        this.name = name;
        this.promise = null;
    }
    
    nameElement() {
        return this.name && $("<b>").text(this.name + ": ");
    }
    
    simpleElement() {
        // this.promise = null;
        return $("<span>Uninstantiated NexusFormElement</span>");
    }
    
    toElement() {
        return $("<div>").append(
            this.nameElement(),
            this.simpleElement()
        );
    }
    
    info() {
        // order here is important; toElement instantiates `this.promise`
        this.element = this.toElement();
        return {
            promise: this.promise,
            element: this.element,
        };
    }
}

class NexusFormElementCollection extends NexusFormElement {
    constructor(...children) {
        super(null);
        this.children = children;
        this.enclosed = false;
    }
    
    enclose(status = true) {
        this.enclosed = status;
        return this;
    }
    
    toElement() {
        let container = $("<div>");
        // console.log(this.children);
        container.append(...this.children.map(child => child.toElement()));
        this.promise = Promise.race(
            this.children
                .map(child => child.promise)
                .filter(child => child !== null)
        );
        return this.enclosed ? container : container.children();
    }
}

// freeform
class NexusFormHTML extends NexusFormElement {
    constructor(html) {
        super(null);
        this.html = html;
    }
    
    toElement() {
        return $(this.html);
    }
}

// line break
class NexusFormBreak extends NexusFormHTML {
    constructor(lined = false) {
        super(document.createElement(lined ? "hr" : "br"));
    }
}

class NexusFormInput extends NexusFormElement {
    constructor(name, type = "text", defaultValue = null) {
        super(name);
        this.type = type;
        this.defaultValue = defaultValue;
    }
    
    simpleElement() {
        let input = NexusGUI.input(this.type);
        
        if(this.defaultValue !== null) {
            input.val(this.defaultValue);
        }
        
        return input;
    }
}

class NexusFormButton extends NexusFormElement {
    constructor(name) {
        super(name);
        this.listeners = [];
    }
    
    click(cb) {
        this.listeners.push(cb);
        return this;
    }
    
    removeListener(cb) {
        let oldListenerCount = this.listeners.length;
        this.listeners = this.listeners.filter(fn => fn !== cb);
        return oldListenerCount > this.listeners.length;
    }
    
    simpleElement() {
        let button = NexusGUI.button(this.name);
        
        this.promise = new Promise((resolve, reject) => {
            button.click((ev) => {
                for(let cb of this.listeners) {
                    cb.bind(this)(ev, resolve, reject);
                }
            });
        });
        
        return button;
    }
    
    toElement() {
        return this.simpleElement();
    }
}

class NexusFormDropdown extends NexusFormElement {
    constructor(name, size) {
        super(name);
        this.size = size;
        this.options = [];
    }
    
    addOption(...options) {
        for(let option of options) {
            let config;
            if(typeof option === "string") {
                config = { text: option };
            }
            else {
                config = option;
            }
            config.value = typeof config.value === "undefined" ? config.text : config.value;
            config.css = config.css || {};
            this.options.push(config);
        }
    }
    
    simpleElement() {
        let select = $("<select>");
        
        if(typeof this.size !== "undefined") {
            select.attr("size", this.size.toString());
        }
        
        for(let option of this.options) {
            let optionElement = $("<option>")
                .val(option.value)
                .text(option.text)
                .css(option.css);
            select.append(optionElement);
        }
        
        return select;
    }
    
    toElement() {
        return this.simpleElement();
    }
}

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
        
        elements.popupWrapper = $("<div id='nexus-gui-popup-wrapper'><div id='nexus-gui-popup-background'></div><div id='nexus-gui-popup'><h2 id='nexus-gui-popup-title'></h2><button id='nexus-gui-close-button'>X</button><div id='nexus-gui-popup-content'>WOOOOO</div></div></div>");
        elements.popup = elements.popupWrapper.find("#nexus-gui-popup");
        elements.background = elements.popupWrapper.find("#nexus-gui-popup-background");
        elements.title = elements.popupWrapper.find("#nexus-gui-popup-title");
        elements.content = elements.popupWrapper.find("#nexus-gui-popup-content");
        elements.closeButton = elements.popupWrapper.find("#nexus-gui-close-button");
        
        elements.closeButton.click(() => NexusGUI.closePopup());
        
        // elements.background.click(function () {
            // elements.popupWrapper.toggle(false);
        // });
        elements.popupWrapper.toggle(false);
        
        $("body").append(elements.popupWrapper);
        
        NexusGUI._popupElementsLoaded = true;
    },
    _popupStyles: ["wide", "minimal", "minimal-padded"],
    _cleanUpPopup: null,
    get isPopupOpen() {
        let background = NexusGUI._popupElements.background;
        return background && background.is(":visible");
    },
    popup: function (title, content, options = {}) {
        if(NexusGUI.isPopupOpen) {
            NexusGUI.closePopup(true);
        }
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
            let cleanUp = (forceClosed = false) => {
                if(!options.ignoreForceClose || !forceClosed) {
                    resolve();
                }
                elements.background.unbind("click", cleanUp);
                NexusGUI._cleanUpPopup = null;
                elements.popupWrapper.toggle(false);
            };
            NexusGUI._cleanUpPopup = cleanUp;
            
            elements.background.bind("click", () => cleanUp(false));
        });
    },
    closePopup: function (forceClose = false) {
        if(NexusGUI._cleanUpPopup) {
            NexusGUI._cleanUpPopup(forceClose);
        }
    },
    button: (text) => $("<button>").addClass("nexus-gui-button").text(text),
    input: (type) => $("<input>").attr("type", type).addClass(`engine-${type}-box`),
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
    dropdown: function (message, options, overallConfig) {
        let content = $("<div>");
        let select = $("<select>");
        let okButton = NexusGUI.button("OK");
        let cancelButton = NexusGUI.button("Cancel");
        
        overallConfig = overallConfig || {};
        
        if(typeof overallConfig.size !== "undefined") {
            select.attr("size", overallConfig.size.toString());
        }
        
        for(let option of options) {
            let config;
            if(typeof option === "string") {
                config = { text: option };
            }
            else {
                config = option;
            }
            config.value = typeof config.value === "undefined" ? config.text : config.value;
            config.css = config.css || {};
            let optionElement = $("<option>")
                .val(config.value)
                .text(config.text)
                .css(config.css);
            select.append(optionElement);
        }
        
        content.append(
            select,
            $("<div>").append(okButton, cancelButton)
        );
        
        setTimeout(() => select.scrollTop(0), 0);
        
        return new Promise((resolve, reject) => {
            okButton.click(() => {
                resolve(select.val());
                NexusGUI.closePopup();
            });
            cancelButton.click(() => {
                resolve(null);
                NexusGUI.closePopup();
            });
            NexusGUI.popup(message, content).then(() => {
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
        let pageContainer = $("<div class=nexus-gui-page-container>");
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
            
            // hide if only 1 page
            pageContainer.toggle(pages.length !== 1);
            
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
NexusGUI.FormElement = NexusFormElement;
NexusGUI.FormElementCollection = NexusFormElementCollection;
NexusGUI.Form = NexusForm;
NexusGUI.FormInput = NexusFormInput;
NexusGUI.FormButton = NexusFormButton;
NexusGUI.FormDropdown = NexusFormDropdown;
NexusGUI.FormHTML = NexusFormHTML;
NexusGUI.FormBreakConstructor = NexusFormBreak;
NexusGUI.FormBreak = new NexusFormBreak();
NexusGUI.FormOKCancel = (okfn, cancelfn, separate = true) => {
    let ok = new NexusGUI.FormButton("OK")
        .click(okfn);
    let cancel = new NexusGUI.FormButton("Cancel")
        .click(cancelfn);
    return new NexusFormElementCollection(ok, cancel).enclose(separate);
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
            /* 50.1 is a weird fix for borders */
            transform: translate(-50%, -50.1%);
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
        #nexus-gui-popup.minimal,
        #nexus-gui-popup.minimal-padded {
            width: auto;
            min-height: 0px;
            height: auto;
        }
        #nexus-gui-popup.minimal-padded {
            padding: 2em;
        }
        #nexus-gui-popup-title {
            margin: 0;
            margin-bottom: 0.2em;
            border-bottom: 1px #7A7A7A;
        }
        #nexus-gui-close-button {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #8c281b;
            color: white;
            border: 1px solid #701f14;
            cursor: pointer;
        }
        #nexus-gui-close-button:hover {
            background: #d73d29;
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
