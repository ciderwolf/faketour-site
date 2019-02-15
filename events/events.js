getDataWait("events.php", function(response) {
    events = JSON.parse(response);
    for(event of events) {
        if(event.open) {
            title.innerHTML = "Faketour <i>" + event.name + "</i>";
            configureButton(event);
            document.getElementById("current-symbol").appendChild(createSetLink(event));
        }
        else {
            let setLink = createSetLink(event);
            previous.appendChild(setLink);
        }
    }
});

getDataWait("getPlayers.php", function(response) {
    let players = JSON.parse(response);
    if(players.length == 0) {
        players.push("none");
    }
    let display = document.getElementById("players");
    let play = document.createElement("p");
    for(player of players) {
        play.innerHTML += player + "<br>";
    }
    display.appendChild(play);
});

function configureButton(event) {
    let registerButton = document.getElementById("register");
    registerButton.id = event.code;
    registerButton.onclick = function(e) {
        getDataWait("events.php?reg=" + event.code, function(response) {
            if(response == "success") {
                showAlert("Registered", "Successfully registered for event: " + event.name, "success");
                registerButton.disabled = true;
            }
            else if(response == "duplicate") {
                showAlert("Error", "Already registered for event: " + event.name, "warning");
                registerButton.disabled = true;
            }
            else {
                showAlert("Error", "Failed to register for event: " + event.name, "error");
            }
        });
    }
}

function createSetLink(event) {
    let setLink = document.createElement("a"); 
    setLink.href = "/about/" + event.code;
    setLink.title = "Faketour " + event.name;
    setLink.classList.add("symbol-link");
    let setSymbol = document.createElement("i");
    setSymbol.className = "ss ss-" + event.code + " ss-mythic ss-grad ss-5x";
    setLink.appendChild(setSymbol);
    return setLink;
}