let buttonClicked = null;
const formats = ["limited", "constructed"];

let username;
let matchData = {};
loadData();

async function loadData() {
    let response = await fetch("/php/user.php?value=username");
    username = await response.text();
    if(username == "null") username = null;
    for(format of formats) {
        let data = await fetch("getMatches.php?format=" + format);
        matchData[format] = await data.json();
        loadMatches(format);
    }
}

function loadMatches(format) {
    let display = document.getElementById(format);
    if(username === null) {
        display.innerHTML += "<p>You need to be logged in to view your matches</p>";
        return;
    }
    let i = 0;
    for(let match of matchData[format]) {
        if(match === undefined) {
            continue;
        }
        let opponent = match.player_one == username ? match.player_two : match.player_one;
        let roundName = match.round;
        if(!isNaN(roundName)) {
            roundName = "Round " + roundName;
        }
        let matchDisplay = document.createElement("p");
        matchDisplay.innerHTML = roundName + ": " + username + " vs. " + opponent;
        let modal = document.createElement("div");
        modal.classList.add("modal");
        let close = document.createElement("span");
        close.addEventListener('click', function(e) {
            modal.style.display = 'none';
        });
        close.classList.add("close");
        close.innerHTML = "&times;";
        close.title = "Cancel";
        modal.appendChild(close);
        let form = document.createElement("form");
        form.classList.add("modal-content");
        form.dataset.format = format;
        form.dataset.index = i;
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
        submitButton.className = "transparent thin";
        container.appendChild(submitButton);
        form.appendChild(container);
        modal.appendChild(form);
        display.appendChild(modal);

        let button = document.createElement("button");
        button.addEventListener('click', function(e) {
            modal.style.display = 'block';
            buttonClicked = this;
        });
        button.innerHTML = "Submit Results";
        matchDisplay.appendChild(button);

        display.appendChild(matchDisplay);

        i += 1;
    }
    if(matchData[format].length === 0) {
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
    let format = form.dataset.format;
    let index = form.dataset.index;
    let match = matchData[format][index];
    let score = userWins + "-" + opponentWins;
    if(username == match.player_two) {
        score = opponentWins + "-" + userWins;
    }
    updateMatch(match.id, score);
}

// dismiss form on background clicked
window.onclick = function(event) {
    let modals = document.getElementsByClassName('modal');
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