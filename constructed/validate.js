const unlimitedCards = ["Plains", "Island", "Swamp", "Mountain", "Forest", "Relentless Rats", "Persistent Petitioners"];
let standardLegal = undefined;
const maindeckSize = 60;
const sideboardSize = 15;
const maxCardCount = 4;

function validateDeck(maindeck, sideboard) {
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
        showAlert("Deck too small", "Your maindeck has only " + maindeckCount + " cards.", "warning");
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
        showAlert("Sideboard too large", "Your sideboard has " + sideboardCount + " cards.", "warning");
        return false;
    }
    for(card in deck) {
        if(!standardLegal.includes(card)) {
            showAlert("Illegal card", "'" + card + "' isn't standard legal", "warning");
            return false;
        }
        if(deck[card] > maxCardCount && !unlimitedCards.includes(card)) {
            showAlert("Illegal card count", "You have " + deck[card] + " copies of '" + card + "' in your deck", "warning");
            return false;
        }
    }
    return true;
}

