let loggedIn;
let timer = document.getElementById("timer");
let due;
let updateTimer = setInterval("getTimer();", 1000);

loadData();

function getTimer() {
    let now = new Date();
    let difference = (due.getTime() - now.getTime())/1000;
    if(difference < 0) {
        timer.innerHTML = "Decklists were due on " +  due.toLocaleString();
        clearInterval(updateTimer);
        return;
    }
    let days = Math.floor(difference/(3600*24));
    let hours = Math.floor(difference/(3600)) - days*24;
    let minutes = Math.floor(difference/60) - hours*60 - days*24*60;
    let seconds = Math.floor(difference) - minutes*60 - hours*3600 - days*24*3600;
    let dateString = pad(days,2) + ":" + pad(hours,2) + ":" + pad(minutes,2) + ":" + pad(seconds,2);
    timer.innerHTML = "Decklists Due: " + dateString + "<i><br>(" + due.toLocaleString() + ")</i>";
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

async function loadData() {
    let data = await fetch("/php/user.php?page=submit_constructed");
    let response = await data.json();
    if(response != true && response != null) {
        let maindeck = document.getElementById("maindeck");
        let sideboard = document.getElementById("sideboard");
        maindeck.value = response.maindeck.join("\n");
        sideboard.value = response.sideboard.join("\n");
    }
    if(response === null) {
        showAlert("Log in", "You need to be <a class=alert-link href='/account/login/'>logged in</a> to submit your deck list", "warning");
    }
    else if(response === true) {
        document.getElementById("preview").style.display = "none";
    }
    else {
        updateDeckCounts(response.maindeck, response.sideboard);
    }

    loggedIn = response;


    let dateData = await fetch("getDate.php");
    let date = await dateData.text();
    due = new Date(date);
    if(new Date().getTime() - due.getTime() > 0) {
        document.getElementById("submit").style.display = "none";
    }
    getTimer();
}

function updateDeckCounts(maindeck, sideboard) {
    deck = deckFromStrings(maindeck, sideboard);
    for(let zone in deck) {
        let size = 0;
        Object.values(deck[zone]).forEach(v => size += v);
        document.getElementById(zone + "-count").textContent = size;
    }
}

function uploadDeck(cardList, setCode) {
    let request = new XMLHttpRequest();
    request.open("POST", "uploadDeck.php" + (setCode !== undefined ? "?set=" + setCode : ""), true);
    request.setRequestHeader("body", JSON.stringify(cardList));
    request.send();
    request.onload = function (e) {
      if (request.readyState === 4) {
        if (request.status === 200) {
            if(request.responseText == "register") {
                showAlert("Please <a class='alert-link' href='/events/'>Register</a>", "You need to be registered for the event in order to submit your decklist", "warning");
            } else {
                showAlert("Deck submitted successfully", "Click <a class='alert-link' href='preview/'>here</a> to see a preview", "success");
            }
        } else {
            console.log(request.responseText);
            showAlert("Encountered an error",  "Check the console for more information.", "error");
        }
      }
    };
}

async function submit() {
    if(due === undefined) {
        return;
    }

    let maindeck = document.getElementById("maindeck").value.split("\n");
    let sideboard = document.getElementById("sideboard").value.split("\n");   
    let valid = await validateDeck(maindeck, sideboard);
    updateDeckCounts(maindeck, sideboard);
    if(!valid) {
        return;
    }
    let dueTime = due.getTime() - new Date().getTime();
    let upload = {
        "maindeck": maindeck,
        "sideboard": sideboard
    };
    if(loggedIn === null) {
        showAlert("Error", "You need to be logged in to submit your deck.", "error", true);
    }
    else if (dueTime < 0) {
        showAlert("Deck submission is no longer available.", "", "warning", true);
    }
    else {
        uploadDeck(upload);
    }
}