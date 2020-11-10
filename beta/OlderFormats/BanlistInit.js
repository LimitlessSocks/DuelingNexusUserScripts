const BANLISTS = [];

const registerFormatBanlist = (name, ids) => {
    BANLISTS.push({
        name: name,
        ids: ids,
    });
}