let matches = {};
let buttonClicked = null;
const formats = ["limited", "constructed"];

//load data asynchronously
let loggedIn;
let matchData = {};
logIn();
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
    if(loggedIn != undefined && matchData.hasOwnProperty("limited") && matchData.hasOwnProperty("constructed")) {
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
    if(match != undefined && !(Object.keys(match).length === 0 && match.constructor === Object)) {
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
        let maxGameWins = Math.floor(match.games/2) + 1;
        let playerOneScoreBar = createNumberBar(maxGameWins);
        let playerOneLabel = document.createElement("label");
        playerOneLabel.innerHTML = "Number of games you won: ";
        container.appendChild(playerOneLabel);
        container.appendChild(playerOneScoreBar);
        let playerTwoScoreBar = createNumberBar(maxGameWins);
        let playerTwoLabel = document.createElement("label");
        playerTwoLabel.innerHTML =  "Number of games " + opponent + " won: ";
        container.appendChild(playerTwoLabel);
        container.appendChild(playerTwoScoreBar);

        let submitButton = document.createElement("button");
        submitButton.style = "width:100%;margin-left:0;";
        submitButton.innerHTML = "Report";
        container.appendChild(submitButton);
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

function createNumberBar(maxGameWins) {
    let scoreBar = document.createElement("div");
    scoreBar.classList.add("selector-bar");
    for(let i = 0; i <= maxGameWins; i++) {
        let score = document.createElement("div");
        score.classList.add("selector");
        if(i == 0) {
            score.classList.add("selected");
            score.classList.add("right");
        }
        score.value = i;
        score.innerHTML = i;
        score.onclick = function(e) {
            let oldValue = 0;
            if(e.srcElement.parentElement.getElementsByClassName("selected").length > 0) {
                let selected = e.srcElement.parentElement.getElementsByClassName("selected")[0];
                selected.className = "selector";
                oldValue = selected.value;
            }
            score.classList.add("selected");
            if(oldValue > score.value) {
                score.classList.add("right");
            } else {
                score.classList.add("left");
            }
            scoreBar.value = score.value;
        }
        scoreBar.appendChild(score);
    }
    scoreBar.value = 0;
    return scoreBar;
}

function updateMatch(id, score) {
    let url = "updateMatch.php?id=" + id + "&score=" + score;
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
    let inputs = form.firstElementChild.getElementsByClassName("selector-bar");
    let userWins = inputs[0].value;
    let opponentWins = inputs[1].value;
    let format = form.classList[1];
    let match = matches[format];
    let score = userWins + "-" + opponentWins;
    if(loggedIn == match.player_two) {
        score = opponentWins + "-" + userWins;
    }
    updateMatch(match.id, score);
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



