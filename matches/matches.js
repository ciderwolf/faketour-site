let matches = {};
let buttonClicked = null;
const formats = ["limited", "constructed"];

//load data asynchronously
let loggedIn;
let matchData = {};
let staticForm;
logIn();
getDataWait("staticForm.txt", function(response) {
    staticForm = response;
    checkLoaded();
});
for(format of formats) {
    loadMatchData(format);
}

getDataWait("/php/loggedIn.php?page=create_pairings", function(response) {
    let admin = JSON.parse(response);
    if(admin) {
        let createButton = document.createElement("button");
        createButton.innerHTML = "Create Pairings";
        createButton.onclick = function(e) {
            window.location.href = 'create';
        };
        document.getElementById("buttons").appendChild(createButton);
    }
});

function loadMatchData(format) {
    getDataWait("getMatches.php?format=" + format, function(response) {
        matchData[format] = JSON.parse(response);
        checkLoaded();
    })
}

function logIn() {
    getDataWait("/php/loggedIn.php?page=matches", function(response) {
        if(response == "true " || response == "false") {
            loggedIn = JSON.parse(response);
        } else {
            loggedIn = response;
        }
        checkLoaded();
    });
}

function checkLoaded() {
    if(loggedIn != undefined && matchData.hasOwnProperty("limited") && matchData.hasOwnProperty("constructed") && staticForm != undefined) {
        for(format of formats) {
            loadMatches(format);
        }
    }
}

function loadMatches(format) {
    let display = document.getElementById(format);
    if(loggedIn === false) {
        display.innerHTML += "<p>You need to be logged in to view your matches</p>";
        return;
    }
    let match = matchData[format][0];
    if(!(Object.keys(match).length === 0 && match.constructor === Object)) {
        let opponent = match.player_one == loggedIn ? match.player_two : match.player_one;
        let roundName = match.round;
        if(!isNaN(roundName)) {
            roundName = "Round " + roundName;
        }
        matches[format] = match;
        let matchDisplay = document.createElement("p");
        matchDisplay.innerHTML = roundName + ": " + loggedIn + " vs. " + opponent;
        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.id = "submit_" + format;
        let close = document.createElement("span");
        close.addEventListener('click', function(e) {
            document.getElementById('submit_' + format).style.display='none';
        });
        close.classList.add("close");
        close.innerHTML = "&times;";
        close.title = "Cancel";
        modal.appendChild(close);
        let form = document.createElement("form");
        form.classList.add("modal-content");
        form.classList.add(format);
        form.addEventListener('submit', function(e) {
            submit(this);
            window.onclick(null);
            if(buttonClicked instanceof HTMLButtonElement) {
                buttonClicked.disabled = true;
            }
        });
        form.target = "dummyframe";
        let container = document.createElement("div");
        container.classList.add("container");
        let title = document.createElement("h1");
        title.innerHTML = "Report Result";
        container.appendChild(title);
        container.innerHTML += "<label><b>Match winner</b><br></label>"
        let radio1 = document.createElement("input");
        radio1.type = "radio";
        radio1.name = "winner";
        radio1.required = true;
        radio1.id = loggedIn;
        container.appendChild(radio1);
        container.innerHTML += loggedIn;
        let radio2 = document.createElement("input");
        radio2.type = "radio";
        radio2.name = "winner";
        radio2.required = true;
        radio2.id = opponent;
        container.appendChild(radio2);
        container.innerHTML += opponent;
        container.innerHTML += "<br>" + staticForm;
        form.appendChild(container);
        modal.appendChild(form);
        display.appendChild(modal);

        let button = document.createElement("button");
        button.addEventListener('click', function(e) {
            document.getElementById('submit_' + format).style.display='block';
            buttonClicked = this;
        });
        button.innerHTML = "Submit Results";
        matchDisplay.appendChild(button);

        display.appendChild(matchDisplay);
    }
    else {
        display.innerHTML += "<p>No " + format + " matches right now</p>";
    }
}

function updateMatch(id, score) {
    let url = "updateMatch.php?id=" + id + "&score=" + score;
    console.log(url);
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = function (e) {
      if (request.readyState === 4) {
        if (request.status === 200) {
            showAlert("Success!", "Match result submitted successfully.", "success");
        } else {
            console.log(request.responseText);
            showAlert("Encountered an error", " Check the console for more information.", "error");
        }
      }
    };
    request.send();
}

function submit(form) {
    let inputs = form.firstElementChild.getElementsByTagName("input");
    let userWins = inputs[2].value;
    let opponentWins = inputs[3].value;
    let score = userWins + "-" + opponentWins;
    if(opponentWins > userWins) {
        score = opponentWins + "-" + userWins;
    }
    let id = matches[format].id;
    updateMatch(id, score);
}

// dismiss form on background clicked
let modals = document.getElementsByClassName('modal');
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



