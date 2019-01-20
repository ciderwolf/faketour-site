let loggedIn;
const maindeckSize = 60;
const sideboardSize = 15;
let timer = document.getElementById("timer");
let due = new Date("Sun Jan 20 2019 23:59:59");
setInterval("getTimer();", 1000);

logIn();
getTimer();

function getTimer() {
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
            showAlert("Deck submitted successfully", "", "success");
        } else {
            console.log(request.responseText);
            showAlert("Encountered an error",  "Check the console for more information.", "error");
        }
      }
    };
}

function submit() {
    let maindeck = document.getElementById("maindeck").value.split("\n");
    let maindeckCount = 0;
    for(line of maindeck) {
        let elements = line.split(' ');
        if(isNaN(elements[0])) {
            maindeckCount ++;
        }
        else {
            maindeckCount += Number(elements[0]);
        }
    }
    if(maindeckCount <= maindeckSize) {
        showAlert("Deck too small", "You maindeck has only " + maindeckCount + " cards.", "warning");
        return;
    }
    let sideboard = document.getElementById("sideboard").value.split("\n");
    let sideboardCount = 0;
    for(line of maindeck) {
        let sideboard = line.split(' ');
        if(isNaN(elements[0])) {
            sideboardCount ++;
        }
        else {
            sideboardCount += Number(elements[0]);
        }
    }
    if(sideboardCount >= sideboardSize) {
        showAlert("Sideboard too large", "You sideboard has " + maindeckCount + " cards.", "warning");

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
