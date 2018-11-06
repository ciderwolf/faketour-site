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
	let playerOrder = [];
	let playerNames = Object.keys(players);
	let playerCount = playerNames.length;
	while(playerOrder.length < playerCount) {
		let greatestRecord = 0;
		let winner = "";
		for(player of playerNames) {
			let playerRecord = (players[player].constructed.wins + players[player].sealed.wins)/(players[player].constructed.losses + players[player].sealed.losses);
			if(playerRecord > greatestRecord) {
				greatestRecord = playerRecord;
				winner = player;
			}
		}
		playerOrder.push(winner);
		playerNames.splice(playerNames.indexOf(winner), 1);
	}

	let standings = document.getElementById("standings");
	let light = false;
	for(playerName of playerOrder) {
		let playerObj = players[playerName];
		let player = document.createElement("tr");
		player.classList.add("standing");
		if(light) {
			player.classList.add("light");
		}
		light = !light;
		let name = document.createElement("td");
		name.innerHTML = playerName;
		name.style.color = "orange";
		let standard = document.createElement("td");
		standard.innerHTML = playerObj.constructed.wins + "-" + playerObj.constructed.losses;
		standard.classList.add("cell");
		let sealed = document.createElement("td");
		sealed.innerHTML = playerObj.sealed.wins + "-" + playerObj.sealed.losses;
		sealed.classList.add("cell");
		let total = document.createElement("td");
		total.innerHTML = playerObj.sealed.wins + playerObj.constructed.wins + "-" + (playerObj.sealed.losses + playerObj.constructed.losses);
		total.classList.add("cell");
		player.appendChild(name);
		player.appendChild(standard);
		player.appendChild(sealed);
		player.appendChild(total);

		standings.appendChild(player);
	}
}






