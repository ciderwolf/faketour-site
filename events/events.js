let disableButton;

getDataWait("events.php", function(response) {
    events = JSON.parse(response);
    let foundOpen = false;
    for(let i = 0; i < events.length; i++) {
        let event = events[i];
        if(event.open || (!foundOpen && i == events.length - 1)) {
            foundOpen = true;
            title.innerHTML = "Faketour <i>" + event.name + "</i>";
            if(event.open) {
                configureButton(event);
                disableButton = true;
            } else {
                let button = document.getElementById("register");
                button.innerHTML = "View Results";
                button.outerHTML = "<a href='/about/" + event.code + "/results'>" + button.outerHTML + "</a>";
                disableButton = false;
            }
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

    getDataWait("/php/user.php?value=username", function(loggedIn) {
        if(loggedIn != "null" && disableButton == true) {
            if(players.includes(loggedIn)) {
                document.getElementById("register").disabled = true;
            }
        }
    })

});

function configureButton(event) {
    let registerButton = document.getElementById("register");
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
            else if(response == "login") {
                showAlert("Error", "Need to be logged in to register for events", "warning");
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