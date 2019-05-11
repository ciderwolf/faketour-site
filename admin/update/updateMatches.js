function updateMatch(match) {
    let id = match.id;
    let format = document.getElementById("format-selector" + id).value;
    let round = document.getElementById("round-name" + id).value;
    let playerOne = document.getElementById("player-one-name" + id).value;
    let playerTwo = document.getElementById("player-two-name" + id).value;
    getDataWait("updateMatch.php?" + params({id, format, round, playerOne, playerTwo}), function(response) {
        if(response == "") {
            showAlert("Success", "Match updated successfully", "success");
        } else {
            console.log(response);
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
    let joined = [];
    for(let key in parameters) {
        joined.push(key + "=" + parameters[key]);
    }
    return joined.join("&");
}