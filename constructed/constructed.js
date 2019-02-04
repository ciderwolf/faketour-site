let loggedIn;
let timer = document.getElementById("timer");
let due = new Date("Mon Jan 21 2019 23:59:59");
let updateTimer = setInterval("getTimer();", 1000);

logIn();
getTimer();

function getTimer() {
    let now = new Date();
    let difference = (due.getTime() - now.getTime())/1000;
    if(difference < 0) {
        timer.innerHTML = "Decklists were due " +  due.toString().substring(0, due.toString().indexOf(" GMT"));
        clearInterval(updateTimer);
        return;
    }
    let days = Math.floor(difference/(3600*24));
    let hours = Math.floor(difference/(3600)) - days*24;
    let minutes = Math.floor(difference/60) - hours*60 - days*24*60;
    let seconds = Math.floor(difference) - minutes*60 - hours*3600 - days*24*3600;
    let dateString = pad(days,2) + ":" + pad(hours,2) + ":" + pad(minutes,2) + ":" + pad(seconds,2);
    timer.innerHTML = "Decklists Due: " + dateString + "<i><br>(" + due.toString().substring(0, due.toString().indexOf(" GMT")) + ")</i>";
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
            showAlert("Deck submitted successfully", "Click <a class='alert-link' href='preview'>here</a> to see a preview", "success");
        } else {
            console.log(request.responseText);
            showAlert("Encountered an error",  "Check the console for more information.", "error");
        }
      }
    };
}

function submit() {
    let maindeck = document.getElementById("maindeck").value.split("\n");
    let sideboard = document.getElementById("sideboard").value.split("\n");
    let valid = false;
    if(standardLegal == undefined) {
        showAlert("Validating deck", "", "info");
        getDataWait("cards.json", function(response) {
            standardLegal = JSON.parse(response);
            submit();
        });
        return;
    } else {
        valid = validateDeck(maindeck, sideboard);
    }
    if(!valid) {
        return;
    }
    let dueTime = due.getTime() - new Date().getTime();
    let upload = {
        "maindeck": maindeck,
        "sideboard": sideboard
    };
    if(loggedIn === false) {
        showAlert("Error", "You need to be logged in to submit your deck.", "error");
    }
    else if (dueTime < 0) {
        showAlert("Deck submission is no longer available.", "", "warning");
    }
    else {
        uploadDeck(upload);
    }
}
