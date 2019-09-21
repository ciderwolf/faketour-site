let legalCards = undefined;
const unlimitedCards = ["Plains", "Island", "Swamp", "Mountain", "Forest", "Persistent Petitioners"];
const maindeckSize = 60;
const sideboardSize = 15;
const maxCardCount = 4;

function deckFromStrings(maindeck, sideboard) {
    let deck = {maindeck: [], sideboard: []};
    for(line of maindeck) {
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

function validateDeck(maindeck, sideboard) {
    if(document.getElementById("validate-checkbox").checked == false) {
        return true;
    }
    let deck = {};
    let maindeckCount = 0;
    for(line of maindeck) {
        let elements = line.split(' ');
        let count = 1;
        let name = line;
        if(!isNaN(elements[0])) {
            count = Number(elements[0]);
            elements.splice(0, 1);
            name = elements.join(' ');
        }
        if(deck[name] == undefined) {
            deck[name] = count;
        }
        else {
            deck[name] += count;
        }
        maindeckCount += count;
    }
    if(maindeckCount < maindeckSize) {
        showAlert("Deck too small", "Your maindeck has only " + maindeckCount + " cards.", "warning", true);
        return false;
    }
    let sideboardCount = 0;
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
            deck[name] = count;
        }
        else {
            deck[name] += count;
        }
        sideboardCount += count;
    }
    if(sideboardCount > sideboardSize) {
        showAlert("Sideboard too large", "Your sideboard has " + sideboardCount + " cards.", "warning", true);
        return false;
    }
    for(card in deck) {
        if(!isLegal(card)) {
            showAlert("Illegal card", "'" + card + "' isn't stanard legal", "warning", true);
            return false;
        }
        if(deck[card] > maxCardCount && !unlimitedCards.includes(card)) {
            showAlert("Illegal card count", "You have " + deck[card] + " copies of '" + card + "' in your deck", "warning", true);
            return false;
        }
    }
    return true;
}

function isLegal(card) {
    card = card.trim();
    if(card == "") {
        return true;
    }
    for(cardName of legalCards) {
        if(cardName.toLowerCase() == card.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function validateClicked() {
    document.getElementById("validate-checkbox").click();
}