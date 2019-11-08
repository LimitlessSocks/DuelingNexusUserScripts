// DeckSortHeader.js
// defines the DeckSort constant for other pieces of the code
// as well as other pieces of useful code

const DeckSort = {
    
};

let waitFrame = function () {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
}

let waitForElement = async function (selector, source = document) {
    let query;
    while ((query = source.querySelector(selector)) === null) {
        await waitFrame();
    }
    return query;
}

let waitForNoElement = async function (selector, source = document) {
    while (source.querySelector(selector) !== null) {
        await waitFrame();
    }
    return;
}