async function updateMatch(match) {
    let id = match.id;
    console.log(match);
    let format = document.getElementById("format-selector" + id).value;
    let round = document.getElementById("round-name" + id).value;
    let playerOne = document.getElementById("player-one-name" + id).value;
    let playerTwo = document.getElementById("player-two-name" + id).value;
    let score = document.getElementById("score" + id).value;
    let data = await fetch("updateMatch.php?" + params({id, format, round, playerOne, playerTwo, score}));
    let response = await data.text();
    if(response == "") {
        showAlert("Success", "Match updated successfully", "success");
    } else {
        console.log(response);
        showAlert("Failed to update match", "Check the console for more information", "warning");
    }
}

async function deleteMatch(match) {
    let data = await fetch("deleteMatch.php?id=" + match.id);
    let response = await data.text();
    if(response == "") {
        showAlert("Success", "Match updated successfully", "success");
    } else {
        console.log(response);
        showAlert("Failed to delete match", "Check the console for more information", "warning");
    }
}

function params(parameters) {
    let joined = [];
    for(let key in parameters) {
        joined.push(key + "=" + parameters[key]);
    }
    return joined.join("&");
}