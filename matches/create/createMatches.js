let options = {
    "limited": [],
    "constructed": []
};
let count = 0;
let players = [];
getDataWait("/php/loggedIn.php?page=create_pairings", function(response) {
    let valid = JSON.parse(response);
    if(!valid) {
        alert("You need to be logged in as an administrator to upload pairings.");
        window.location.href = window.location.origin;
    } else {
        document.body.style.display = "block";
    }
});
getDataWait("/events/getPlayers.php", function(response) {
    players = JSON.parse(response);
    players.remove("");
    if(players.length % 2 == 1) {
        players.push("Bye");	
    }
});

function addMatchElement(format) {
    let container = document.getElementById(format);
    let matchForm = document.createElement("div");
    count ++;
    let number = String(count);
    let line = document.createElement("p");
    line.classList.add("format");
    line.appendChild(createSelector(format, number));
    let text = document.createElement("p");
    text.innerHTML = "&emsp;vs.&emsp;";
    line.appendChild(text);
    line.appendChild(createSelector(format, number));
    let remove = document.createElement("button");
    remove.classList.add("delete");
    remove.addEventListener('click', function(e) {
        options[format] = options[format].filter(option => option.name != number);
        matchForm.removeChild(line);
    });
    remove.innerHTML = "Remove Pairing";
    line.appendChild(remove);
    matchForm.appendChild(line);
    container.appendChild(matchForm);
}

function createSelector(format, number) {
    let select = document.createElement("select");
    select.classList.add(format + "Selector");
    let defaultOption = document.createElement("option");
    defaultOption.innerHTML = "Select a player";
    select.appendChild(defaultOption);
    for(player of players) {
        let option = document.createElement("option");
        option.value = player;
        option.innerHTML = player;
        option.name = number;
        select.appendChild(option);
        options[format].push(option);
    }
    select.onchange = function() { updateSelectedPlayers(format) };
    defaultOption.disabled = true;
    updateSelectedPlayers(format);
    return select;
}

function updateSelectedPlayers(format) {
    let selectedPlayers = getPlayersSelected(format);
    for(option of options[format]) {
        if(selectedPlayers.includes(option.value)) {
            option.disabled = true;
        }
        else {
            option.disabled = false;
        }
    }
}

function getPlayersSelected(format) {
    let selected = []
    let selectors = document.getElementsByClassName(format + "Selector");
    for(select in selectors) {
        let index = players.indexOf(selectors[select].value);
        if(index >= 0) {
            selected.push(players[index]);
        }
    }
    return selected;
}

function uploadPairings() {
    let roundName = document.getElementById("round-name").value;
    let games = document.getElementById("games").value;
    if(games % 2 == 0) {
        showAlert("Invalid game number", "An even number of games was selected", "warning");
        return;
    }
    if(roundName == "") {
        showAlert("Round Name can't be blank", "Please choose a round name or number", "warning");
        return;
    }
    for(format of Object.keys(options)) {
        let upload = [];
        let selectors = document.getElementsByClassName(format + "Selector");
        for(i = 0; i < selectors.length; i+=2) {
            let pOneName = selectors[i].value;
            if(pOneName == "Bye") pOneName = "";
            let pTwoName = selectors[i+1].value;
            if(pTwoName == "Bye") pTwoName = "";
            let data = {};
            data.player_one = pOneName;
            data.player_two = pTwoName;
            upload.push(data);
        }
        sendData(format, roundName, games, upload);
        console.log(upload);
    }
}

function sendData(format, roundName, games, data) {
    let request = new XMLHttpRequest();
    request.open("POST", "uploadPairings.php?format=" + format + "&round=" + roundName + "&games=" + games, true);
    request.setRequestHeader("body", JSON.stringify(data));
    request.onload = function (e) {
        console.log(request.responseText);
        if (request.readyState === 4) {
            if (request.status === 200) {
                showAlert(format, "Pairings submitted successfully.", "success");
            } else {
                console.log(request.responseText);
                showAlert("Encountered an error", "Check the console for more information.", "error");
            }
        }
    };
    request.send();
}