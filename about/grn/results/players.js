let players;
getDataWait("players.json", function(response) {
    players = JSON.parse(response);
    for(player of players) {
        createTab(player);
    }
});

function createTab(player) {
    getDataWait("data/" + player + ".json", function(response) {
        let data;
        try {
            data = JSON.parse(response)
        } catch(e) {
            console.log(e, player)
        }

        let decklist = data.constructed_deck;
        let matches = data.matches;

        // create button
        let tabRow = document.getElementById("tabs");
        let tabButton = document.createElement("button");
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

        let standardTitle = document.createElement("h2");
        standardTitle.innerHTML = "Constructed";
        tab.appendChild(standardTitle);
        tab.appendChild(createMatches(matches.constructed, player));
        tab.appendChild(createDecklist(decklist));

        let sealedTitle = document.createElement("h2");
        sealedTitle.innerHTML = "Sealed";
        tab.appendChild(sealedTitle);
        tab.appendChild(createMatches(matches.sealed, player));

        tabRow.appendChild(tabButton);
        tabContent.appendChild(tab);

        if(tabRow.children.length == 1) {
            tabButton.id == "initial";
            tabButton.click();
        }
    });
}

function createMatches(matches, player) {
    let matchesContainer = document.createElement("div");
    matchesContainer.style.display = "flex";
    matchesContainer.style.width = "fit-content";
    matchesContainer.style.margin = "0 auto";
    for(match of matches) {
        let score = match.record.split("-");
        let winner;
        if(score.length == 2) {
            winner = score[0] > score[1] ? player : match.opponent;
        } else {
            winner = "none";
            score[0] = "0";
            score[1] = "0"
        }
        console.log(winner);
        let matchBox = document.createElement("table");
        let oneBox = document.createElement("td");
        oneBox.classList.add("player")
        if(winner == player) {
            oneBox.classList.add("winner");
        }
        oneBox.innerHTML += player;

        let twoBox = document.createElement("td");
        twoBox.classList.add("player")
        if(winner == match.opponent) {
            twoBox.classList.add("winner");
        }
        twoBox.innerHTML += match.opponent;

        let scoreOne = document.createElement("td");
        scoreOne.classList.add("score");
        scoreOne.classList.add("top");
        scoreOne.innerHTML = score[0];
        let scoreTwo = document.createElement("td");
        scoreTwo.classList.add("score");
        scoreTwo.classList.add("bottom");
        scoreTwo.innerHTML = score[1];

        if(winner == player) {
            scoreOne.classList.add("winner");
        } else if(winner == match.opponent) {
            scoreTwo.classList.add("winner");
        }

        let rowOne = document.createElement("tr");
        rowOne.appendChild(oneBox);
        oneBox.classList.add("split");
        rowOne.appendChild(scoreOne);
        let rowTwo = document.createElement("tr");
        rowTwo.appendChild(twoBox);
        rowTwo.appendChild(scoreTwo);
        matchBox.appendChild(rowOne);
        matchBox.appendChild(rowTwo);
        let borderBox = document.createElement("div");
        borderBox.classList.add("match");
        borderBox.appendChild(matchBox);
        matchesContainer.appendChild(borderBox);
    }
    return matchesContainer;
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
        cardLink.href = card.scryfall_uri;
        let preview = document.createElement("img");
        preview.classList.add("card-preview");
        preview.src = card.image_uri;
        cardLink.addEventListener('mouseover', function(e) {
            preview.style.display = "inline";
            preview.style.left = e.pageX;
            let newY = e.pageY;
            if(newY + preview.height > window.innerHeight) {
                newY = window.innerHeight - preview.height;
            }
            preview.style.top = newY
        });
        cardLink.addEventListener('mouseleave', function(e) {
            preview.style.display = "none";
        });
        cardLink.onmousemove = function(e) {
            preview.style.left = e.pageX;
            let newY = e.pageY;
            if(newY + preview.height > window.innerHeight) {
                newY = window.innerHeight - preview.height;
            }
            preview.style.top = newY
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
