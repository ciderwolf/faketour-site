const loggedIn = logIn();
const players = JSON.parse(getData("players.json"));
let matches = [];
const formats = ["sealed", "std"];
for(format of formats) {
	loadMatches(format);
}

function logIn() {
	let response = getData("loggedIn.php");
	if(response == "true " || response == "false") {
		return JSON.parse(response);
	} else {
		return response;
	}
}

function getPlayer(format, mode, key) {
	return players[format][mode][key];
}

function loadMatches(format) {
	let display = document.getElementById(format);
	if(loggedIn === false) {
		display.innerHTML += "You need to be logged in to view your matches";
		return;
	}
	let usernames = players[format];
	let challonge_id = usernames.username[loggedIn];
	let api_key = getKey();
	let response = loadExternalData("https://api.challonge.com/v1/tournaments/ft_grn_" + format + "/matches.json?api_key=" + api_key);
	let data = JSON.parse(response);
	let hasMatch = false;
	for(match of data) {
		if(match.match.state == "open" && (match.match.player1_id == challonge_id || match.match.player2_id == challonge_id)) {
			hasMatch = true;
			matches.push(match.match);
			let matchId = match.match.id;
			let matchDisplay = document.createElement("p");
			matchDisplay.innerHTML = usernames.id[match.match.player1_id] + " vs. " + usernames.id[match.match.player2_id];
			let modal = document.createElement("div");
			modal.classList.add("modal");
			modal.id = "submit_" + matchId;

			let close = document.createElement("span");
			close.addEventListener('click', function(e) {
				document.getElementById('submit_' + matchId).style.display='none';
			});
			close.classList.add("close");
			close.innerHTML = "&times;";
			close.title = "Cancel";
			modal.appendChild(close);
			let form = document.createElement("form");
			form.classList.add("modal-content");
			form.classList.add(format);
			form.addEventListener('submit', function(e) {
				submit(this);
				window.onclick(null);
			});
			form.target = "dummyframe";
			let container = document.createElement("div");
			container.classList.add("container");
			let title = document.createElement("h1");
			title.innerHTML = "Report Result";
			container.appendChild(title);
			container.innerHTML += "<label><b>Match winner</b><br></label>"
			let radio1 = document.createElement("input");
			radio1.type = "radio";
			radio1.name = "winner";
			radio1.required = true;
			radio1.id = match.match.player1_id;
			container.appendChild(radio1);
			container.innerHTML += usernames.id[match.match.player1_id];
			let radio2 = document.createElement("input");
			radio2.type = "radio";
			radio2.name = "winner";
			radio2.required = true;
			radio2.id = match.match.player2_id;
			container.appendChild(radio2);
			container.innerHTML += usernames.id[match.match.player2_id];
			container.innerHTML += "<br><br>" + getData("staticForm.txt");
			form.appendChild(container);
			modal.appendChild(form);
			display.appendChild(modal);

			let button = document.createElement("button");
			button.addEventListener('click', function(e) {
				console.log('submit_' + matchId)
				document.getElementById('submit_' + matchId).style.display='block';
			});
			button.innerHTML = "Submit Results";
			matchDisplay.appendChild(button);

			display.appendChild(matchDisplay);
		}
	}
	if(!hasMatch) {
		let formatName = "sealed";
		if(format == "std") formatName = "constructed";
		display.innerHTML += "No " + formatName + " matches right now";
	}
}

function loadExternalData(url) {
	return getData("loadURL.php?url=" + url);
}

function getKey() {
	return getData("challonge.apikey");
}

function getData(url) {
	let request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.send();
	return request.responseText;
}

function updateMatch(tournament, match, winner, record) {
	let url = "putURL.php?tournament=" + tournament + "&match=" + match + "&winner=" + winner + "&record=" + record;
	console.log(url);
	let request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onload = function (e) {
	  if (request.readyState === 4) {
		if (request.status === 200) {
			showAlert("Success!", "Match submitted successfully.", "success");
		} else {
			console.log(request.responseText);
			showAlert("Encountered an error", "Check the console for more information.", "error");
		}
	  }
	};
	request.send();
}

function submit(form) {
	let inputs = form.firstElementChild.getElementsByTagName("input");
	let winnerId = 0;
	if(inputs[1].checked) {
		winnerId = 1;
	}
	let wins = inputs[2].value;
	let losses = inputs[3].value;

	let format = form.classList[1];
	let tournament = "ft_grn_" + format;
	let match = matches[formats.indexOf(format)].id;
	let winner = inputs[winnerId].id;
	console.log(getPlayer(format, "id", winner), winnerId, inputs[1].checked, format);
	let record;
	if(inputs[0].id == getPlayer(format, "username", loggedIn)) {
		record = wins + "-" + losses;
	} else {
		record = losses + "-" + wins;
	}
	updateMatch(tournament, match, winner, record);
}

// Get the modal
var modals = document.getElementsByClassName('modal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	let dismiss = false;
	if(event == null) {
		event = new MouseEvent(null);
		dismiss = true;
	}
	for(modal of modals) {
		if (event.target == modal || dismiss) {
			modal.style.display = "none";
		}
	}
}



