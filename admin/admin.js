function closeEvent() {
    updateEvent("open", "0");
}

function uploadEvent() {
    let dateString = getInputValue("event-duedate-input");
    let name = getInputValue("event-name-input");
    let code = getInputValue("event-code-input");
    if(dateString != "" && name != "" && code != "") {
        fetch("updateEvent.php?date=" + dateString + "&name=" + name + "&code=" + code)
        .then(response => response.text())
        .then(response => {
            if(response == "") {
                showAlert("Success", "Event created successfully", "success");
            } else {
                showAlert("Failed to create event", "Check the console for more information", "error");
                console.log(response);
            }
        });
    }
}

function updateDueDate() {
    let dateString = getInputValue("event-duedate-input");
    if(dateString == "") {
        return;
    }
    if(new Date(dateString).toString() == "Invalid Date") {
        showAlert("Invalid date", "Failed to parse '" + dateString + "' as a date", "error");
    }
    updateEvent("decks_due", dateString);
}

function getInputValue(id) {
    let element = document.getElementById(id);
    if(element.value == "") {
        showAlert("Invalid input", element.name + " is invalid", "warning");
    }
    return element.value;
}

async function updateEvent(key, value) {
    let data = await fetch("updateEvent.php?key=" + key + "&value=" + value);
    let response = await data.text();
    if(response == "") {
        showAlert("Success", "Event updated successfully", "success");
    } else {
        showAlert("Failed to update event", "Check the console for more information", "error");
        console.log(response);
    }
}