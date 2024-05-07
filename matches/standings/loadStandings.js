fetch("getStandings.php")
    .then(response => response.json())
    .then(({ matches, players }) => {
        if (matches.limited.length === 0 && matches.constructed.length === 0) {
            document.getElementById("container").style.display = "none";
            let noStandings = document.createElement('h1');
            noStandings.classList.add("no-standings");
            noStandings.textContent = 'No standings right now';
            document.body.appendChild(noStandings);
        }
        else {
            createStandings(matches, players);
        }
    });

function createStandings(rawMatchData, players) {
    const [limited, constructed] = transformData(rawMatchData);
    const constructedPlayerData = calculatePlayerData(constructed);
    const limitedPlayerData = calculatePlayerData(limited);
    const combinedPlayerData = combineFormatData(limitedPlayerData, constructedPlayerData);
    sortPlayers(combinedPlayerData);
    sortPlayers(limitedPlayerData);
    sortPlayers(constructedPlayerData);
    fillOtherPlayers(combinedPlayerData, players);
    fillOtherPlayers(limitedPlayerData, players);
    fillOtherPlayers(constructedPlayerData, players);

    createTable(combinedPlayerData, "total");
    createTable(limitedPlayerData, "limited");
    createTable(constructedPlayerData, "constructed");
}

function fillOtherPlayers(playerData, players) {
    for (const player of players) {
        const playerHasData = playerData.some(data => data.player === player);
        if (!playerHasData) {
            playerData.push({
                player: player,
                matchRecord: [0, 0],
                gameRecord: [0, 0],
                omp: NaN,
                ogp: NaN
            });
        }
    }
}

function createTable(playerData, tableName) {
    const table = document.getElementById(tableName);

    for (let i = 0; i < playerData.length; i++) {
        const row = createRow(playerData[i], i % 2 === 0);
        table.appendChild(row);
    }
    if (document.getElementsByClassName("tab")[0].offsetParent !== null) {
        isMobile = false;
        document.getElementById("initial").click();
    }
}

function createRow(playerData, light) {
    const row = document.createElement('tr');
    row.classList.add("standing");

    row.appendChild(createCell(playerData.player, highlight = true));
    row.appendChild(createCell(playerData.matchRecord.join("-")));
    row.appendChild(createCell(formatPercentage(playerData.omp)));
    row.appendChild(createCell(playerData.gameRecord.join("-")));
    row.appendChild(createCell(formatPercentage(playerData.ogp)));

    if (light) {
        row.classList.add("light");
    }

    return row;
}

function formatPercentage(percentage) {
    if (isNaN(percentage)) {
        return "--";
    } else {
        return `${Math.round(percentage * 100)}%`;
    }
}

function createCell(content, highlight = false) {
    const cell = document.createElement('td');
    cell.textContent = content;
    if (highlight) {
        cell.style.color = "orange";
    } else {
        cell.classList.add("cell");
    }
    return cell;
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

window.addEventListener("resize", function () {
    let desktopSize = window.matchMedia("(min-width: 600px)").matches;
    if (desktopSize && isMobile) {
        isMobile = false;
        document.getElementById("initial").click();
    } else if (!desktopSize && !isMobile) {
        let tabcontent = document.getElementsByClassName("tabcontent");
        isMobile = true;
        for (let content of tabcontent) {
            content.style.display = "block";
        }
    }
});