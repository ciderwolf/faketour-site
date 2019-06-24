let players;
loadData();

window.onload = function(e) {
    console.log(e);
    document.getElementById("tab-bg").height = document.getElementById("players").offsetHeight;
}

async function loadData() {
    let playerResponse = await fetch("players.json");
    players = await playerResponse.json();
    for(player of players) {
        loadPlayer(player);
    }
}

async function loadPlayer(player) {
    let playerData = await fetch("data/" + player + ".json");
    let playerJSON = await playerData.json();
    createTab(player, playerJSON);
}

function createTab(player, data) {
    // create button
    let tabRow = document.getElementById("tabs");
    let tabButton = document.createElement("span");
    tabButton.classList.add("tablinks");
    tabButton.onclick = function(e) {
        showTab(e, player + "-content");
    }
    tabButton.innerHTML = player;

    // create content
    let tabContent = document.getElementById("players");
    let tab = document.createElement("div");
    tab.classList.add("tabcontent");
    tab.classList.add("backdrop");
    tab.id = player + "-content";
    tab.appendChild(createDecklist(data));

    tabRow.appendChild(tabButton);
    tabContent.appendChild(tab);

    if(tabRow.children.length == 1) {
        tabButton.id == "initial";
        tabButton.click();
    }
}

function createDecklist(decklist) {
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
        let cardLink = document.createElement("a");
        cardLink.innerHTML = card.count + " " + card.name + "<br>";
        cardLink.href = "https://scryfall.com/card/" + card.set + "/" + card.number;
        let preview = document.createElement("img");
        preview.classList.add("card-preview");
        preview.src = "https://api.scryfall.com/cards/" + card.set + "/" + card.number + "?format=image&version=normal";
        cardLink.addEventListener('mouseover', function(e) {
            preview.style.display = "inline";
            preview.style.left = e.pageX;
            preview.style.top = normalizePreviewY(e, preview);
        });
        cardLink.addEventListener('mouseleave', function(e) {
            preview.style.display = "none";
        });
        cardLink.onmousemove = function(e) {
            preview.style.left = e.pageX;
            preview.style.top = normalizePreviewY(e, preview);
        }
        type.appendChild(cardLink);
        type.appendChild(preview);
        count += card.count;
    }
    title.innerHTML += " (" + count + ") <br>";
    return type;
}

function showTab(evt, tab) {
    let tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tab).style.display = "block";
    evt.currentTarget.classList.add("active");
}

function normalizePreviewY(e, preview) {
    let newY = e.pageY;
    if(newY + preview.height > window.innerHeight + window.scrollY) {
        newY = window.innerHeight + window.scrollY - preview.height;
    }
    return newY;
}
