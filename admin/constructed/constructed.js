async function sendData(format) {
    const response = await fetch("downloadLegalities.php?format=" + format);

    if (response.ok) {
        const data = await response.json();
        showAlert("Download successful", `Dowloaded ${data.cards} cards for ${data.format}`, "success");
    } else {
        const data = await response.text();
        console.log(data);
        showAlert("Encountered an error", "Check the console for more information.", "error");
    }
    hideLoadingSpinner();
}

function downloadCards() {
    let format = document.getElementById("format").value;
    showLoadingSpinner();
    sendData(format);
}

function showLoadingSpinner() {
    let button = document.getElementById('download-button');
    button.disabled = true;
    let spinner = button.getElementsByTagName('span')[0];
    spinner.style.display = 'inline-block';
    button.innerHTML = '';
    button.appendChild(spinner);
    button.innerHTML += 'Loading Data...';
}

function hideLoadingSpinner() {
    let button = document.getElementById('download-button');
    button.disabled = false;
    let spinner = button.getElementsByTagName('span')[0];
    spinner.style.display = 'none';
    button.innerHTML = '';
    button.appendChild(spinner);
    button.innerHTML += 'Donwload Legal Cards';
}
