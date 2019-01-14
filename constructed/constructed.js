let loggedIn;
let timer = document.getElementById("timer");
setInterval("getTimer();", 1000);

logIn();
getTimer();

function getTimer() {
	let due = new Date("Fri Jan 25 2019 23:59:59");
	let now = new Date();
	let difference = (due.getTime() - now.getTime())/1000;
	let days = Math.floor(difference/(3600*24));
	let hours = Math.floor(difference/(3600)) - days*24;
	let minutes = Math.floor(difference/60) - hours*60 - days*24*60;
	let seconds = Math.floor(difference) - minutes*60 - hours*3600 - days*24*3600;
	let dateString = pad(days,2) + ":" + pad(hours,2) + ":" + pad(minutes,2) + ":" + pad(seconds,2);
	timer.innerHTML = "Decklists Due: " + dateString;
}

function pad(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
}

function logIn() {
	getDataWait("/php/loggedIn.php?page=submit_constructed", function(response) {
		let hasDeck = false;
		if(response != "true" && response != "false") {
			response = response.substring(1,response.length-1);
			hasDeck = true;
		}
		let responseJSON = JSON.parse(response);
		if(hasDeck) {
			let maindeck = document.getElementById("maindeck");
			let sideboard = document.getElementById("sideboard");
			maindeck.value = responseJSON.maindeck.join("\n");
			sideboard.value = responseJSON.sideboard.join("\n");
		}
		loggedIn = responseJSON;
	});
}


function getData(url) {
	let request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.send();
	return request.responseText;
}

function uploadDeck(cardList) {
	let request = new XMLHttpRequest();
	request.open("POST", "uploadDeck.php", true);
	request.setRequestHeader("body", JSON.stringify(cardList));
	request.send();
	request.onload = function (e) {
	  if (request.readyState === 4) {
		if (request.status === 200) {
			let button = document.getElementById("submit");
			button.innerHTML = "Deck submitted successfully!";
			setInterval(function() {button.innerHTML = 'Submit Deck'}, 2000);
			if(request.responseText.trim() != "true") {
				alert("Failed to submit deck", request.responseText, "error")
			}
		} else {
			console.log(request.responseText);
			alert("Encountered an error",  "Check the console for more information.", "error");
		}
	  }
	};
}

function submit() {
	let maindeck = document.getElementById("maindeck").value.split("\n");
	let sideboard = document.getElementById("sideboard").value.split("\n");
	let due = new Date("Fri Oct 06 2018 23:59:59").getTime() - new Date().getTime();
	let upload = {
		"maindeck": maindeck,
		"sideboard": sideboard
	};
	if(loggedIn === false) {
		alert("Error", "You need to be logged in to submit your deck.", "error");
	}
	else if (due < 0) {
		alert("Deck submission is no longer available.", "", "warning");
	}
	else {
		uploadDeck(upload);
	}

}
