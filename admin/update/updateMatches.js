function updateMatch(match) {
    let format = match.getElementById("format-selector").value;
    let round = match.getElementById("round-name").value;
    let playerOne = match.getElementById("player-one-name").value;
    let playerTwo = match.getElementById("player-two-name").value;
    let id = match.id;
    getDataWait("updateMatch.php?" + params({id, format, round, playerOne, playerTwo}), function(response) {
        if(response == "") {
            showAlert("Success", "Match updated successfully", "success");
        } else {
            showAlert("Failed to update match", "Check the console for more information", "warning");
        }
    });
}

function deleteMatch(match) {
    getDataWait("deleteMatch.php?id=" + match.id, function(response) {
        if(response == "") {
            showAlert("Success", "Match updated successfully", "success");
        } else {
            showAlert("Failed to delete match", "Check the console for more information", "warning");
        }
    });
}

function params(parameters) {
    return parameters.map(e => {
        let keys = Object.keys(e);
        return keys[0] + "=" + keys[1];
    }).join("&");
}