let players;
let decklists = {};
getDataWait("players.json", function(response) {
    players = JSON.parse(response);
    for(player of players) {
        getDecklist(player);
    }
});

function getDecklist(player) {
    getDataWait("decks/" + player + ".json", function(response) {
        let decklist;
        try {
            decklist = JSON.parse(response)["constructed_deck"];
        } catch(e) {
            console.log(e, player)
        }
        decklists[player] = decklist;
        // create button
        let tabRow = document.getElementById("tabs");
        let tabButton = document.createElement("button");
        tabButton.classList.add("tablinks");
        tabButton.onclick = function(e) {
            showTab(e, player + "-content");
        }
        tabButton.innerHTML = player;

        let sideboard = decklist.Sideboard;
        delete decklist.Sideboard;


        // create content
        let tabContent = document.getElementById("players");
        let tab = document.createElement("div");
        tab.classList.add("tabcontent");
        tab.classList.add("backdrop");
        tab.id = player + "-content";

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

        tab.appendChild(rowOne);
        tab.appendChild(rowTwo);
        tab.appendChild(rowThree);

        tabRow.appendChild(tabButton);
        tabContent.appendChild(tab);

        if(tabRow.children.length == 1) {
            tabButton.id == "initial";
            tabButton.click();
        }
    });
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
    document.getElementById(tab).style.display = "flex";
    evt.currentTarget.classList.add("active");
}
