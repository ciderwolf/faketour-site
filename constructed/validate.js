function deckFromStrings(maindeck, sideboard) {
    let deck = {maindeck: [], sideboard: []};
    for(let line of maindeck) {
        let elements = line.split(' ');
        let count = 1;
        let name = line;
        if(!isNaN(elements[0])) {
            count = Number(elements[0]);
            elements.splice(0, 1);
            name = elements.join(' ');
        }
        if(deck[name] == undefined) {
            deck.maindeck[name] = count;
        }
        else {
            deck.maindeck[name] += count;
        }
    }
    for(line of sideboard) {
        let elements = line.split(' ');
        let count = 1;
        let name = line;
        if(!isNaN(elements[0])) {
            count = Number(elements[0]);
            elements.splice(0, 1);
            name = elements.join(' ');
        }
        if(deck[name] == undefined) {
            deck.sideboard[name] = count;
        }
        else {
            deck.sideboard[name] += count;
        }
    }
    return deck;
}

async function validateDeck(maindeck, sideboard) {
    if(document.getElementById("validate-checkbox").checked == false) {
        return true;
    }
    const r = await fetch('validate.php', {
        method: "POST",
        body: JSON.stringify({ maindeck, sideboard })
    });
    const response = await r.json();
    if(response.valid === true) {
        return true;
    } else {
        showAlert(response.title, response.details, "warning", true);
        return false;
    }
}

function validateClicked() {
    document.getElementById("validate-checkbox").click();
}