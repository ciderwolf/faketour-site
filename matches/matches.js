const loggedIn = logIn();
let matches = {};
let buttonClicked = null;
const formats = ["sealed", "constructed"];
for(format of formats) {
    loadMatches(format);
}

function logIn() {
	let response = getData("/php/loggedIn.php?page=matches");
	if(response == "true " || response == "false") {
		return JSON.parse(response);
	} else {
		return response;
	}
}

function loadMatches(format) {
	let display = document.getElementById(format);
	if(loggedIn === false) {
		display.innerHTML += "You need to be logged in to view your matches";
		return;
	}
	let data = JSON.parse(getData("getMatches.php?format=" + format));
    let match = data[loggedIn];
    if(match.rounds_completed != match.opponents.length) {
		let opponent = match.opponents[match.opponents.length-1];
		matches[format] = match;
		let matchDisplay = document.createElement("p");
		matchDisplay.innerHTML = loggedIn + " vs. " + opponent;
		let modal = document.createElement("div");
		modal.classList.add("modal");
		modal.id = "submit_" + format;
		let close = document.createElement("span");
		close.addEventListener('click', function(e) {
			document.getElementById('submit_' + format).style.display='none';
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
            if(buttonClicked instanceof HTMLButtonElement) {
                buttonClicked.disabled = true;
            }
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
		radio1.id = loggedIn;
		container.appendChild(radio1);
		container.innerHTML += loggedIn;
		let radio2 = document.createElement("input");
		radio2.type = "radio";
		radio2.name = "winner";
		radio2.required = true;
		radio2.id = opponent;
		container.appendChild(radio2);
		container.innerHTML += opponent;
		container.innerHTML += "<br><br>" + getData("staticForm.txt");
		form.appendChild(container);
		modal.appendChild(form);
		display.appendChild(modal);

		let button = document.createElement("button");
		button.addEventListener('click', function(e) {
			document.getElementById('submit_' + format).style.display='block';
		});
		button.innerHTML = "Submit Results";
		matchDisplay.appendChild(button);

		display.appendChild(matchDisplay);
	}
	else {
		display.innerHTML += "No " + format + " matches right now";
	}
}

function loadExternalData(url) {
	return getData("loadURL.php?url=" + url);
}

function getData(url) {
	let request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.send();
	return request.responseText;
}

function updateMatch(format, round, opponent, opponentWins, youWins) {
	let url = "updateMatch.php?format=" + format + "&round=" + round + "&opponentWins=" + opponentWins + "&youWins=" + youWins + "&opponent=" + opponent;
    console.log(url);
	let request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onload = function (e) {
	  if (request.readyState === 4) {
		if (request.status === 200) {
			alert("Match submitted successfully.");
		} else {
			console.log(request.responseText);
			alert("Encountered an error. Check the console for more information.");
		}
	  }
	};
	request.send();
}

function submit(form) {
	let inputs = form.firstElementChild.getElementsByTagName("input");
    let opponent = inputs[1].id;
	let userWins = inputs[2].value;
	let opponentWins = inputs[3].value;
	let format = form.classList[1];
    let round = matches[format].rounds_completed + 1;
	updateMatch(format, round, opponent, opponentWins, userWins);
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



