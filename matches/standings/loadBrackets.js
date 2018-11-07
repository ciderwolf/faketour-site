let players = {};

const formats = ["constructed", "sealed"];
getData();

function getData() {
	let request = new XMLHttpRequest();
	request.open("GET", "getStandings.php", true);
	request.onload = function (e) {
	 	if (request.readyState === 4) {
			if (request.status === 200) {
				createStandings(request.responseText);
			} else {
				console.log(request.responseText);
				alert("Encountered an error", " Check the console for more information.", "error");
			}
	  	}
	};	request.send();
} 

function createStandings(data) {
	let players = JSON.parse(data);
	let sealedRows = {};
	let constructedRows = {};
	let totalRows = {};
	for(playerName of Object.keys(players)) {
		let player = players[playerName];
		sealedRows[playerName] = createFormatRow(player, "sealed");
		constructedRows[playerName] = createFormatRow(player, "constructed");
		totalRows[playerName] = createTotalRow(player);
	}
	
	let light = false;
	let sealedTable = document.getElementById("sealed");
	for(playerName of createFormatOrder(players, "sealed")) {
		if(light) {
			sealedRows[playerName].classList.add("light");
		}
		light = !light;
		sealedTable.appendChild(sealedRows[playerName]);
	}
	light = false;
	let constructedTable = document.getElementById("constructed");
	for(playerName of createFormatOrder(players, "constructed")) {
		if(light) {
			constructedRows[playerName].classList.add("light");
		}
		light = !light;
		constructedTable.appendChild(constructedRows[playerName]);
	}
	light = false;
	let totalTable = document.getElementById("total");
	for(playerName of createTotalOrder(players)) {
		if(light) {
			totalRows[playerName].classList.add("light");
		}
		light = !light;
		totalTable.appendChild(totalRows[playerName]);
	}

	document.getElementById("initial").click();

}

function createFormatRow(player, format) {
	let playerRow = document.createElement("tr");
	playerRow.classList.add("standing");
	let name = document.createElement("td");
	name.innerHTML = playerName;
	name.style.color = "orange";
	let matchScore = document.createElement("td");
	matchScore.innerHTML = player[format].matches.wins + "-" + player[format].matches.losses;
	matchScore.classList.add("cell");
	let gameScore = document.createElement("td");
	gameScore.innerHTML = player[format].games.wins + "-" + player[format].games.losses;
	gameScore.classList.add("cell");
	playerRow.appendChild(name);
	playerRow.appendChild(matchScore);
	playerRow.appendChild(gameScore);
	return playerRow;
}

function createFormatOrder(players, format) {
	let playerOrder = [];
	let playerNames = Object.keys(players);
	let playerCount = playerNames.length;
	while(playerOrder.length < playerCount) {
		let greatestRecord = 0;
		let winner = "";
		for(player of playerNames) {
			let playerRecord = players[player][format].games.wins/players[player][format].games.losses;
			if(playerRecord > greatestRecord) {
				greatestRecord = playerRecord;
				winner = player;
			}
		}
		playerOrder.push(winner);
		playerNames.splice(playerNames.indexOf(winner), 1);
	}
	return playerOrder;
}

function createTotalOrder(players) {
	let playerOrder = [];
	let playerNames = Object.keys(players);
	let playerCount = playerNames.length;
	while(playerOrder.length < playerCount) {
		let greatestRecord = 0;
		let winner = "";
		for(player of playerNames) {
			let playerRecord = (players[player].constructed.games.wins + players[player].sealed.games.wins)/(players[player].constructed.games.losses + players[player].sealed.games.losses);
			if(playerRecord > greatestRecord) {
				greatestRecord = playerRecord;
				winner = player;
			}
		}
		playerOrder.push(winner);
		playerNames.splice(playerNames.indexOf(winner), 1);
	}
	return playerOrder;
}

function createTotalRow(player) {
	let playerRow = document.createElement("tr");
	playerRow.classList.add("standing");
	let name = document.createElement("td");
	name.innerHTML = playerName;
	name.style.color = "orange";
	let matchScore = document.createElement("td");
	matchScore.innerHTML = player.sealed.matches.wins + player.constructed.matches.wins + "-" + (player.sealed.matches.losses + player.constructed.matches.losses);
	matchScore.classList.add("cell");
	let gameScore = document.createElement("td");
	gameScore.innerHTML = player.sealed.games.wins + player.constructed.games.wins + "-" + (player.sealed.games.losses + player.constructed.games.losses);
	gameScore.classList.add("cell");
	playerRow.appendChild(name);
	playerRow.appendChild(matchScore);
	playerRow.appendChild(gameScore);
	return playerRow;
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