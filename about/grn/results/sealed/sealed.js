let oldSets = ["rav", "gpt", "dis", "rtr", "gtc", "dgm"];
let pool = [];
let poolCreated = false;
let loggedIn;
let cardData = {};
let sets = [];

logIn();

function getCardImage(card) {
    fetch("https://api.scryfall.com/cards/named?fuzzy=" + card.alt)
    .then(response => response.json())
    .then(data => {
        card.src = data.image_uris.normal;
    }); 
}

async function logIn() {
    let data = await fetch("/php/user.php?page=generate_sealed");
    let response = await data.json();
    if(response != true && response != null) {
        document.getElementById("generate").innerHTML = "Save Pool";
        let setDisplay = document.getElementById("generated");
        for(set in response) {
            if(set == "grn") {
                setDisplay.innerHTML += createSymbol(set) + createSymbol(set);
            }
            setDisplay.innerHTML += createSymbol(set);
            sets.push(set);
        }
        constructPool(response);
    }
    loggedIn = (response == null ? false : response);
}

function generate() {
    let viewer = document.getElementById("cards");
    let nums = Array.apply(null, {length: oldSets.length}).map(Number.call, Number);
    let display = document.getElementById("generated");
    let packSets = [];
    for(let i = 0; i < 3; i++) {
        display.innerHTML += createSymbol("grn");
        packSets.push("grn");
    }
    for (let i = 0; i < 3; i++) {
        let index = Math.floor(Math.random()*nums.length);
        let oldCode = oldSets[nums.splice(index, 1)];
        packSets.push(oldCode)
        display.innerHTML += createSymbol(oldCode);
    }
    
    sets = packSets;

    document.getElementById("viewer").innerHTML = "<p>Loading Pool...</p>"

    fetch("generatePool.php?sets=" + packSets.join(","))
    .then(response => response.json())
    .then(cards => {
        updatePool(cards);
        constructPool(cards);
        const y = viewer.getBoundingClientRect().top + window.scrollY;
        window.scroll({
            top: y,
            behavior: 'smooth'
        });
    });
}

function getSetData(set) {
    fetch("cards/" + set + "/data.json")
    .then(response => response.json())
    .then(data => {
        cardData[set] = data;
        constructPool(loggedIn);
    });
}

function createSymbol(set) {
    return '<i style="margin-top:30px; margin-right:30px" class="ss ss-' + set + ' ss-3x"></i> ';
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
            showAlert("You need to be logged in to generate a sealed pool.", "", "warning");
        } else {
            constructPool(loggedIn);
        }
        button.innerHTML = "Export Pool";
    }
    else {
          let file = new Blob(Object.keys(pool), {type: "text/plain"});
          button.href = URL.createObjectURL(file);
          button.download = "pool.txt";
    }
}

function constructPool(cards) {
    let viewer = document.getElementById("cards");
    viewer.innerHTML = "";
    let poolStr = "";
    for(set in cards) {
        if(!Object.keys(cardData).includes(set)) {
            getSetData(set);
            return;
        }
    }
    pool = [];
    for(set in cards) {
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