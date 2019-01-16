let accountData;
let avatars;
let events;
const thingsToLoad = 3;
let loaded = 0;
getDataWait("avatar_names.json", function(response) {
	avatars = JSON.parse(response);
	loaded ++;
	if(loaded == thingsToLoad) {
		initialize();
	}
});

getDataWait("events.php", function(response) {
	events = JSON.parse(response);
	loaded ++;
	if(loaded == thingsToLoad) {
		initialize();
	}
});

logIn();


function logIn() {
	getDataWait("/php/loggedIn.php?page=account", function(response) {
		if(response == "true " || response == "false") {
			window.location.href = "login/?";
		} else {
			accountData = JSON.parse(response);
			loaded ++;
			if(loaded == thingsToLoad) {
				initialize();
			}
		}
	});
	
}

function initialize() {
	document.getElementById("title").innerHTML += " &ndash; " + accountData.username;
	let avatarImg = document.getElementById('avatar-img');
	avatarImg.src = "avatars/art_crop/" + avatars.filenames[accountData.avatar];
	avatarImg.name = avatars.cardnames[accountData.avatar];
	let avatarSelect = document.getElementById("avatar-images");
	for(filename of avatars.filenames) {
		let img = document.createElement("img");
		let preview = document.createElement("img");
		preview.src = "avatars/card_image/" + filename;
		preview.classList.add("card-preview");
		img.classList.add("avatar")
		img.id = filename;
		img.src = "avatars/art_crop/" + filename;
		img.addEventListener('mouseover', function(e) {
			preview.style.display = "inline";
			preview.style.left = e.pageX;
			let newY = e.pageY;
			if(newY + preview.height > window.innerHeight) {
				newY = window.innerHeight - preview.height;
			}
			preview.style.top = newY
		});
		img.addEventListener('mouseleave', function(e) {
			preview.style.display = "none";
		});
		img.onmousemove = function(e) {
			preview.style.left = e.pageX;
			let newY = e.pageY;
			if(newY + preview.height > window.innerHeight) {
				newY = window.innerHeight - preview.height;
			}
			preview.style.top = newY
		}
		img.addEventListener('click', function(e) {
			let selected = document.getElementsByClassName("selected");
			for(sel of selected) {
				sel.classList.remove("selected");
			}
			this.classList.add("selected");
			avatarImg.src = "avatars/art_crop/" + this.id;
			avatarImg.name = avatars.cardnames[avatars.filenames.indexOf(this.id)];
		});
		img.addEventListener('dblclick', function(e) {
			document.getElementById('change-avatar').style.display='none';
		});
		avatarSelect.appendChild(img);
		avatarSelect.appendChild(preview);
		if(img.src == avatarImg.src) {
			img.classList.add("selected")
		}
	}

	let eventsContainer = document.getElementById("events");
	eventsContainer.style["padding-left"] = "20px";
	for(event of events) {
		let eventDisplay = createEvent(event);
		eventsContainer.appendChild(eventDisplay);
	}
}

function createEvent(event) {
	let eventDisplay = document.createElement("div");
	eventDisplay.style.display = "flex";
	let title = document.createElement("h3");
	title.innerHTML += event.name + "&emsp;";
	eventDisplay.appendChild(title);
	if(event.open) {
		let registerButton = document.createElement("button");
		registerButton.innerHTML = "Register";
		registerButton.id = event.code;
		registerButton.style["margin-top"] = "7px";
		registerButton.onclick = function(e) {
			getDataWait("events.php?reg=" + event.code, function(response) {
				if(response == "success") {
					alert("Registered", "Successfully registered for event: " + event.name, "success");
					registerButton.disabled = true;
				}
				else if(response == "duplicate") {
					alert("Error", "Already registered for event: " + event.name, "warning");
				}
				else {
					alert("Error", "Failed to register for event: " + event.name, "error");
				}
			});
		}
		eventDisplay.appendChild(registerButton);
	}
	else {
		title.innerHTML += "&mdash;&emsp;closed";
	}
	return eventDisplay;
}

function changeAvatar() {
	document.getElementById("change-avatar").style.display = "block";
}

function logout() {
	alert("Logging out", "", "info");
	getDataWait("logout.php", function() {
		window.location.href = window.location.origin;
	});
}

function changePassword() {
	let passwords = [document.getElementById("password"), document.getElementById("password2")];
	if(passwords[0].value == "" && passwords[1].value == "") {
		return undefined;
	} else if(passwords[0].value == "" || passwords[1].value == "") {
		let blankIndex = Number(passwords[0].value != "");
		passwords[blankIndex].classList.add("required");
		return null;
	} else if(passwords[0].value != passwords[1].value) {
		alert("Invalid", "Passwords need to match", "warning");
		return null;
	}
	else if(passwords[0].value.length > 30) {
		alert("Invalid", "Password maximum length exceeded", "warning");
		return null;
	} else {
		return passwords[1].value;
	}
}

function getNewAvatar() {
	let avatarImg = document.getElementById("avatar-img");
	let newIndex = avatars.cardnames.indexOf(avatarImg.name);
	if(newIndex != accountData.avatar) {
		return newIndex;
	} else {
		return undefined;
	}
}

function uploadChanges() {
	let queries = [];

	let newPassword = changePassword();
	if(newPassword != undefined) {
		queries.push("password=" + newPassword);
	}
	if(newPassword === null) {
		return; 
	}

	let newAvatar = getNewAvatar();
	if(newAvatar != undefined) {
		queries.push("avatar=" + newAvatar);
	}
	if(queries.length != 0) {
		getDataWait("updateInformation.php?" + queries.join("&"), function(response) {
			if(response == "") {
				alert("Success", "Account data updated", "success");
			}
			else {
				console.log(response);
				alert("Encountered an error", "Check the console for more information", "error");
			}
		});
	}
}

// Get the modal
let modals = document.getElementsByClassName('modal');

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