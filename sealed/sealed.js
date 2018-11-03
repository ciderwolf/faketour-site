let oldSets = ["rav", "gpt", "dis", "rtr", "gtc", "dgm"];
let pool = [];
let poolCreated = false;
const loggedIn = logIn();
let cardData = {};

function getCardImage(card) {
	getDataWait("https://api.scryfall.com/cards/named?fuzzy=" + card.alt, function(response) {
		let data = JSON.parse(response);
		card.src = data.image_uris.normal;
		card.title = data.oracle_text;
	}); 
}


function logIn() {
	let responseJSON = getDataWait("/php/loggedIn.php?page=generate_sealed", function(response) {
		let hasPool = false;
		if(response != "true" && response != "false") {
			response = response.substring(1,response.length-1);
			hasPool = true;
		}
		let responseJSON = JSON.parse(response);
		if(hasPool) {
			document.getElementById("generate").innerHTML = "Save Pool";
			drawPool(responseJSON);
			for(set in responseJSON) {
				getSetData(set);
			}
		}
		return responseJSON;
	});

	return responseJSON;
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

function generate() {
	let viewer = document.getElementById("cards");
	let cards = {"grn": []};
	let nums = Array.apply(null, {length: oldSets.length}).map(Number.call, Number);
	let display = document.getElementById("generated");
	for(let i = 0; i < 3; i++) {
		display.innerHTML += createSymbol("grn");
	}
	for (let i = 0; i < 3; i++) {
		cards["grn"].push(...JSON.parse(createPack("grn")));
		let index = Math.floor(Math.random()*nums.length);
		let oldCode = oldSets[nums.splice(index, 1)];
		cards[oldCode] = JSON.parse(createPack(oldCode));
		display.innerHTML += createSymbol(oldCode);
	}
	updatePool(cards);
	drawPool(cards);
	const y = viewer.getBoundingClientRect().top + window.scrollY;
	window.scroll({
		top: y,
		behavior: 'smooth'
	});
}

function createPack(set) {
	return getData("generatePacks.php?set=" + set);
}

function loadCardData(set) {
	return JSON.parse(getData("cards/" + set + "/data.json"));
}

function getSetData(set) {
	let data = getDataWait("cards/" + set + "/data.json", function(response) {
		cardData[set] = JSON.parse(response);
	});
}

function getData(url) {
	let request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.send();
	return request.responseText;
}

function createSymbol(set) {
	return '<i style="margin-top:30px; margin-right:30px"class="ss ss-' + set + ' ss-3x"></i> ';
}

function updatePool(cardList) {
	let request = new XMLHttpRequest();
	request.open("POST", "uploadPool.php", true);
	request.setRequestHeader("body", JSON.stringify(cardList));
	request.send();
}

function sortPool(value) {
	let viewer = document.getElementById("cards");
	pool.sort(function(a, b) {
		return a[value] - b[value];
	});
	viewer.innerHTML = "";
	for(card of pool) {
		let link = document.createElement("a");
		link.href = card.uri;
		link.appendChild(card.element);
		viewer.appendChild(link);
	}
}

function buttonPressed() {
	let button = document.getElementById("generate");
	if(!poolCreated) {
		if(loggedIn === true) {
			generate();
		} else if(loggedIn === false) {
			alert("You need to be logged in to generate a sealed pool.");
		} else {
			drawPool(loggedIn);
		}
		button.innerHTML = "Export Pool";
	}
	else {
		  var file = new Blob(Object.keys(pool), {type: "text/plain"});
		  button.href = URL.createObjectURL(file);
		  button.download = "pool.txt";
	}

}

function drawPool(cards) {
	let viewer = document.getElementById("cards");
	let poolStr = "";
	for(set in cards) {
		if(!Object.keys(cardData).includes(set)) {
			cardData[set] = loadCardData(set);
		}
		let data = cardData[set];
		for(card of cards[set]) {
			let image = document.createElement("img");
			image.classList.add("card");
			let cardObject = data[card];
			cardObject.set = oldSets.indexOf(set);
			cardObject.name = card;
			image.src = cardObject.image_uri;
			image.alt = card;
			image.onerror = function(e) {
				getCardImage(this);
			};
			image.title = card;
			cardObject.element = image;
			pool.push(cardObject);
			let link = document.createElement("a");
			link.href = cardObject.uri;
			link.appendChild(image);
			viewer.appendChild(link);
		}
	}
	poolCreated = true;
	for(card of pool) {
		poolStr += card.name + "\r\n";
	}
	create(poolStr, "pool.txt", "text/plain");
	
}

function create(text, name, type) {
	let dlbtn = document.getElementById("dlbtn");
	var file = new Blob([text], {type: type});
	dlbtn.href = URL.createObjectURL(file);
	dlbtn.download = name;
}

