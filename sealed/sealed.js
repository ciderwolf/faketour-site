let oldSets = ["rav", "gpt", "dis", "rtr", "gtc", "dgm"];
let pool = [];
let poolCreated = false;
let loggedIn;
let cardData = {};
let sets = [];

logIn();

function getCardImage(card) {
    getDataWait("https://api.scryfall.com/cards/named?fuzzy=" + card.alt, function(response) {
        let data = JSON.parse(response);
        card.src = data.image_uris.normal;
        card.title = data.oracle_text;
    }); 
}

function logIn() {
    getDataWait("/php/user.php?page=generate_sealed", function(response) {
        let hasPool = false;
        if(response != "true" && response != "null") {
            response = response.substring(1,response.length-1);
            hasPool = true;
        }
        let responseJSON = JSON.parse(response);
        if(hasPool) {
            document.getElementById("generate").innerHTML = "Save Pool";
            let setDisplay = document.getElementById("generated");
            for(set in responseJSON) {
                if(set == "grn") {
                    setDisplay.innerHTML += createSymbol(set) + createSymbol(set);
                }
                setDisplay.innerHTML += createSymbol(set);
                sets.push(set);
            }
            constructPool(responseJSON);
        }
        loggedIn = responseJSON == true;
    });
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

    getDataWait("generatePool.php?sets=" + packSets.join(","), function(response) {
        let cards = JSON.parse(response);
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
    getDataWait("cards/" + set + "/data.json", function(response) {
        cardData[set] = JSON.parse(response);
        constructPool(loggedIn);
    });
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