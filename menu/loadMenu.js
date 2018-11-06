let pages = {
	"Home": "/",
	"About": "/about/",
	"Sealed": "/sealed/",
	"Constructed": "/constructed/",
	"Players": "/players/",
	"Matches": "/matches/"
};

function loadMenu(activeClass) {
	let div = document.getElementsByClassName("topnav")[0]
	getDataWait("/php/loggedIn.php?page=menu", function(login) {
		let loginPages;
		if(login == "null") {
			loginPages = {
				"Log In": "/account/login/?",
				"Create Account": "/account/create/?"
			};
		} else {
			let loginString = "Logged in as " + login;
			loginPages = {};
			loginPages[loginString] = "/account/";
		}
		for(page of Object.keys(pages)) {
			let name = page;
			let link = pages[name];
			let menuItem = document.createElement("a");
			if(activeClass == name) {
				menuItem.classList.add("active");
			} else {
				menuItem.href = link;
			}
			menuItem.innerHTML = name;
			div.appendChild(menuItem);
		}
		for(page of Object.keys(loginPages)) {
			let name = page;
			let link = loginPages[name];
			let menuItem = document.createElement("a");
			if(activeClass == name || (name.includes("Logged in") && activeClass == "Account")) {
				menuItem.classList.add("active");
			} else {
				menuItem.href = link;
			}
			menuItem.innerHTML = name;
			menuItem.style.float = "right";
			div.appendChild(menuItem);
		}
	});

}

function getDataWait(url, callback) {
	let request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.onload = function (e) {
		if (request.readyState === 4) {
			if (request.status === 200) {
				callback(request.responseText);
			} else {
				console.log(request.responseText);
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

function alert(text, title, kind) {
	let alertBody = document.getElementById("alerts");
	if(alertBody == undefined) {
		alertBody = document.createElement("div");
		alertBody.id = "alerts";
		document.body.appendChild(alertBody);
	}

	let alertElement = document.createElement("div");
	alertElement.classList.add("alert");
	alertElement.classList.add(kind);
	let closeButton = document.createElement("span");
	closeButton.classList.add("close-alert");
	closeButton.innerHTML = "&times;";
	closeButton.onclick =  function(e) {
		var div = this.parentElement;
        div.style.opacity = "0";
		setTimeout(function(){ div.style.display = "none"; }, 600);
	};
	alertElement.appendChild(closeButton);
	let titleElement = document.createElement("strong");
	titleElement.innerHTML = title;
	alertElement.appendChild(titleElement);
	alertElement.innerHTML += "&emsp;" + text;
	alertBody.appendChild(alertElement);
	let close = document.getElementsByClassName("close-alert");

    for (closeButton of close) {
        closeButton.onclick = function(){
            let div = this.parentElement;
            div.style.opacity = "0";
            setTimeout(function(){ 
                div.style.display = "none"; 
                div.remove();
            }, 600);
            
        }
        // console.log(closeButton.onclick)
    }
}