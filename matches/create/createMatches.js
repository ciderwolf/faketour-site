let options = {
	"sealed": [],
	"constructed": []
};
let count = 0;

const playerData = getPlayers();
let players = Object.keys(playerData.sealed);
if(players.length % 2 == 1) {
	players.push("Bye");	
}

logIn();

function logIn() {
	let response = JSON.parse(getData("/php/loggedIn.php?page=create_pairings"));
	if(!response) {
		alert("You need to be logged in as an administrator to upload pairings.");
		window.location.href = window.location.origin;
	}
	return response;
}

function addMatchElement(format) {
	let container = document.getElementById(format);
	let matchForm = document.createElement("div");
	count ++;
	let number = String(count);
	let line = document.createElement("p");
	line.classList.add("format");
	line.appendChild(createSelector(format, number));
	let text = document.createElement("p");
	text.innerHTML = "&emsp;vs.&emsp;";
	line.appendChild(text);
	line.appendChild(createSelector(format, number));
	let remove = document.createElement("button");
	remove.classList.add("delete");
	remove.addEventListener('click', function(e) {
		options[format] = options[format].filter(option => option.name != number);
		matchForm.removeChild(line);
	});
	remove.innerHTML = "Remove Pairing";
	line.appendChild(remove);
	matchForm.appendChild(line);
	container.appendChild(matchForm);
}

function createSelector(format, number) {
	let select = document.createElement("select");
	select.classList.add(format + "Selector");
	let defaultOption = document.createElement("option");
	defaultOption.innerHTML = "Select a player";
	select.appendChild(defaultOption);
	for(player of players) {
		let option = document.createElement("option");
		option.value = player;
		option.innerHTML = player;
		option.name = number;
		select.appendChild(option);
		options[format].push(option);
	}
	select.onchange = function() { updateSelectedPlayers(format) };
	defaultOption.disabled = true;
	updateSelectedPlayers(format);
	return select;
}

function getPlayers() {
	let data = JSON.parse(getData("getMatches.php"));
	// let players = ["certi42", "Maeve", "Ronald Skredlord Nafshi", "PVT Ryan", "Registered Fake Tour Player", "Aiden", "Manlin Never Lucky", "Bye"];
	return data;
}

function updateSelectedPlayers(format) {
	let selectedPlayers = getPlayersSelected(format);
	for(option of options[format]) {
		if(selectedPlayers.includes(option.value)) {
			option.disabled = true;
		}
		else {
			option.disabled = false;
		}

	}
}

function getPlayersSelected(format) {
	let selected = []
	let selectors = document.getElementsByClassName(format + "Selector");
	for(select in selectors) {
		let index = players.indexOf(selectors[select].value);
		if(index >= 0) {
			selected.push(players[index]);
		}
	}
	return selected;
}

function uploadPairings() {
	let upload = {};
	for(format of Object.keys(options)) {
		upload[format] = {};
		let selectors = document.getElementsByClassName(format + "Selector");
		for(i = 0; i < selectors.length; i+=2) {
			let pOneName = selectors[i].value;
			if(pOneName == "Bye") pOneName = "";
			let pTwoName = selectors[i+1].value;
			if(pTwoName == "Bye") pTwoName = "";
			// console.log(pOneName, pTwoName);
			let playerOne;
			let playerTwo;
			if(playerData[format][pOneName] != undefined) {
				playerOne = playerData[format][pOneName].opponents.flat();
			}
			if(playerData[format][pTwoName] != undefined) {
				playerTwo = playerData[format][pTwoName].opponents.flat();
			}
			if(playerOne != undefined) {
				playerOne.push(pTwoName);
				upload[format][pOneName] = playerOne;
			}
			if(playerTwo != undefined) {
				playerTwo.push(pOneName);
				upload[format][pTwoName] = playerTwo;
			}
		}
		sendData(format, upload[format]);
	}
	console.log(upload);
}

function sendData(format, data) {
	let request = new XMLHttpRequest();
	request.open("POST", "uploadPairings.php?format=" + format, true);
	request.setRequestHeader("body", JSON.stringify(data));
	request.onload = function (e) {
		// console.log(request.responseText);
		if (request.readyState === 4) {
			if (request.status === 200) {
				alert(format, "Pairings submitted successfully.", "success");
			} else {
				console.log(request.responseText);
				alert("Encountered an error", "Check the console for more information.", "error");
			}
		}
	};
	request.send();
}

function getData(url) {
	let request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.send();
	return request.responseText;
}


