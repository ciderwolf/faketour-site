const accountData = logIn();
const avatars = JSON.parse(getData("avatar_names.json"));

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

function logIn() {
	let response = getData("/php/loggedIn.php?page=account");
	if(response == "true " || response == "false") {
		window.location.href = "login/?";
	} else {
		return JSON.parse(response);
	}
}

function changeAvatar() {
	document.getElementById("change-avatar").style.display = "block";
}

function getData(url) {
	console.log(url)
	let request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.send();
	return request.responseText;
}

function logout() {
	getData("logout.php");
	window.location.href = window.location.origin;
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
		alert("Passwords need to match");
		return null;
	}
	else if(passwords[0].value.length > 30) {
		alert("Password maximum length exceeded");
		return null;
	} else {
		return passwords[1].value;
	}
}

function getNewAvatar() {
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
	console.log(newAvatar);
	if(newAvatar != undefined) {
		queries.push("avatar=" + newAvatar);
	}
	if(queries.length != 0) {
		getData("updateInformation.php?" + queries.join("&"));
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
