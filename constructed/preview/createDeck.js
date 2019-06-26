let deckData;
let decklist = {};
let legalCards;

loadData();

async function loadData() {
    let cardData = await fetch("cards.json");
    legalCards = await cardData.json();

    let url = "/php/user.php?page=submit_constructed";
    let player = new URL(window.location.href).searchParams.get("user");
    if(player != null) {
        url = "getDeck.php?user=" + decodeURI(player);
    }

    let deckResponse = await fetch(url);
    let response = await deckResponse.json();
    if(response != true && response != null) {
        deckData = response;
        createDecklist();
    } else {
        let text = "Submit your deck to see it here";
        if(response == false) {
            text = "You need to be logged in to see your deck";
        }
        let message = document.getElementById("message");
        message.innerHTML = text;
    }
}

function getLineInfo(line) {
    let elements = line.split(' ');
    let count = 1;
    let name = line;
    if(!isNaN(elements[0])) {
        count = Number(elements[0]);
        elements.splice(0, 1);
        name = elements.join(' ');
    }

    return [name, count];
}

function createDecklist() {
    for(line of deckData.maindeck) {
        if(line == "") {
            continue;
        }
        let data = getLineInfo(line);
        let name = data[0];
        let count = data[1];
        let cardObject = getCard(name);
        let type = cardObject.type;
        if(!decklist.hasOwnProperty(type)) {
            decklist[type] = [];
        }

        if(cardObject.image_uri) {
            image_uri = cardObject.image_uri;
        } else {
            image_uri = `https://api.scryfall.com/cards/${cardObject.id}?format=image&version=normal`;
        }

        decklist[type].push({
            "count": count,
            "name": name,
            "image_uri": image_uri
        });
    }

    decklist.Sideboard = [];
    for(line of deckData.sideboard) {
        if(line == "") {
            continue;
        }
        let data = getLineInfo(line);
        let name = data[0];
        let count = data[1];
        let cardObject = getCard(name);

        if(cardObject.image_uri) {
            image_uri = cardObject.image_uri;
        } else {
            image_uri = `https://api.scryfall.com/cards/${cardObject.id}?format=image&version=normal`;
        }
        decklist.Sideboard.push({
            "name": name,
            "count": count,
            "image_uri": image_uri
        });
    }
    document.getElementById("message").remove();
    document.getElementById("bg").appendChild(createDeckView(decklist));
}


function createDeckView(decklist) {
    let sideboard = decklist.Sideboard;
    delete decklist.Sideboard;
    let rowOnes = [], rowTwos = [], rowOneTotal = 0, rowTwoTotal = 0, rows = []; 
    for(key of Object.keys(decklist).reverse()) {
        rows.push({"count": decklist[key].length, "name": key});
    }
    rows.sort(function(a, b) {
        return b.count - a.count;
    });

    while(rows.length > 0) {
        let current = rows[0]
        if(rowOneTotal <= rowTwoTotal) {
            rowOnes.push(current);
            rowOneTotal += current.count + 4;
        }
        else {
            rowTwos.push(current);
            rowTwoTotal += current.count + 4;
        }
        rows.splice(0, 1);
    }

    let rowOne = document.createElement("div");
    for(item of rowOnes) {
        rowOne.appendChild(createRow(item.name, decklist));
    }

    let rowTwo = document.createElement("div");
    for(item of rowTwos) {
        rowTwo.appendChild(createRow(item.name, decklist));
    }

    let rowThree = document.createElement("div");
    decklist["Sideboard"] = sideboard;
    rowThree.appendChild(createRow("Sideboard", decklist));

    rowOne.classList.add("row");
    rowTwo.classList.add("row");
    rowThree.classList.add("row");

    let deck = document.createElement("div");
    deck.classList.add("deck");
    deck.appendChild(rowOne);
    deck.appendChild(rowTwo);
    deck.appendChild(rowThree);
    return deck;
}

function createRow(name, decklist) {
    let type = document.createElement("div");
    type.classList.add("type");
    let title = document.createElement("h3");
    title.innerHTML = name;
    type.appendChild(title);
    let count = 0;
    for(card of decklist[name]) {
        let cardLine = document.createElement("p");
        cardLine.classList.add("card-line");
        cardLine.innerHTML = card.count + " " + card.name;
        let preview = document.createElement("img");
        preview.classList.add("card-preview");
        preview.src = card.image_uri;
        cardLine.addEventListener('mouseover', function(e) {
            preview.style.display = "inline";
            preview.style.left = e.pageX;
            preview.style.top = normalizePreviewY(e, preview);
        });
        cardLine.addEventListener('mouseleave', function(e) {
            preview.style.display = "none";
        });
        cardLine.onmousemove = function(e) {
            preview.style.left = e.pageX;
            preview.style.top = normalizePreviewY(e, preview);
        }
        type.appendChild(cardLine);
        type.appendChild(preview);
        count += card.count;
    }
    title.innerHTML += " (" + count + ") <br>";
    return type;
}

function normalizePreviewY(e, preview) {
    let newY = e.pageY;
    if(newY + preview.height > window.innerHeight + window.scrollY) {
        newY = window.innerHeight + window.scrollY - preview.height;
    }
    return newY;
}

function getCard(name) {
    if(legalCards[name]) {
        return legalCards[name];
    }
    for(card in legalCards) {
        if(card.toLowerCase().includes(name.toLowerCase())) {
            return legalCards[card];
        }
    }
    return undefined;
}