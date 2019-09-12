let bannedCards = {};


loadData();

async function loadData() {
    let banlistResponse = await fetch("banlist.json");
    bannedCards = await banlistResponse.json();
    let decklist = [];
    for(name in bannedCards) {
        let id = bannedCards[name];
        image_uri = `https://api.scryfall.com/cards/${id}?format=image&version=normal`;
        decklist.push({
            "name": name,
            "image_uri": image_uri
        });
    }

    document.getElementById("message").remove();
    let bg = document.getElementById("bg");
    let title = document.createElement("h2");
    title.innerHTML = "Faketour <i>Modern Horizons</i> Banlist";
    bg.appendChild(title);
    bg.appendChild(createDeckView(decklist));
}

function createDeckView(decklist) {
    
    let len = decklist.length;

    let rowOnes = decklist.slice(0, len / 3);
    let rowTwos = decklist.slice(len / 3, 2 * len / 3);
    let rowThrees = decklist.slice(2 * len / 3, len);

    let rowOne = document.createElement("div");
    rowOne.appendChild(createRow(rowOnes));
    
    let rowTwo = document.createElement("div");
    rowTwo.appendChild(createRow(rowTwos));

    let rowThree = document.createElement("div");
    rowThree.appendChild(createRow(rowThrees));

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

function createRow(list) {
    let column = document.createElement("div");
    column.classList.add("type");
    for(card of list) {
        let cardLine = document.createElement("p");
        cardLine.classList.add("card-line");
        cardLine.innerHTML = card.name;
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
        column.appendChild(cardLine);
        column.appendChild(preview);

    }

    return column;
}

function normalizePreviewY(e, preview) {
    let newY = e.pageY;
    if(newY + preview.height > window.innerHeight + window.scrollY) {
        newY = window.innerHeight + window.scrollY - preview.height;
    }
    return newY;
}