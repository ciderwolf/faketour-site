let pages = {
    "Home": "/",
    "About": "/about/",
    "Constructed": "/constructed/",
    "Players": "/players/",
    "Matches": "/matches/"
};

function loadMenu(activeClass) {
    let div = document.getElementsByClassName("topnav")[0]
    getDataWait("/php/loggedIn.php?page=menu", function(login) {
        let loginPages;
        if(login == "null") {
            loginPages = {
                "Log In": "/account/login/?",
                "Create Account": "/account/create/?"
            };
        } else {
            loginPages = {"My Account": "/account/"};
        }
        for(page of Object.keys(pages)) {
            let name = page;
            let link = pages[name];
            let menuItem = document.createElement("a");
            if(activeClass == name) {
                menuItem.classList.add("active");
            } else {
                menuItem.href = link;
            }
            menuItem.innerHTML = name;
            div.appendChild(menuItem);
        }
        for(page of Object.keys(loginPages)) {
            let name = page;
            let link = loginPages[name];
            let menuItem = document.createElement("a");
            if(activeClass == name) {
                menuItem.classList.add("active");
            } else {
                menuItem.href = link;
            }
            menuItem.innerHTML = name;
            menuItem.style.float = "right";
            div.appendChild(menuItem);
        }
    });

}

function getDataWait(url, callback) {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                callback(request.responseText);
            } else {
                console.log(request.responseText);
            }
        }
    };  
    request.send();	
}

function getData(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    return request.responseText;
}

function showAlert(title, text, kind) {
    let alertBody = document.getElementById("alerts");
    if(alertBody == undefined) {
        alertBody = document.createElement("div");
        alertBody.id = "alerts";
        document.body.appendChild(alertBody);
    }

    let alertElement = document.createElement("div");
    alertElement.classList.add("alert");
    alertElement.classList.add(kind);
    let closeButton = document.createElement("span");
    closeButton.classList.add("close-alert");
    closeButton.innerHTML = "&times;";
    closeButton.onclick =  function(e) {
        var div = this.parentElement;
        div.style.opacity = "0";
        setTimeout(function(){ div.style.display = "none"; }, 600);
    };
    alertElement.appendChild(closeButton);
    let titleElement = document.createElement("strong");
    titleElement.innerHTML = title;
    alertElement.appendChild(titleElement);
    alertElement.innerHTML += "&emsp;" + text;
    alertBody.appendChild(alertElement);
    let close = document.getElementsByClassName("close-alert");

    for (closeButton of close) {
        closeButton.onclick = function(){
            let div = this.parentElement;
            removeAlert(div);
        }
    }
    if(kind === "warning") {
        setTimeout(function() {
            removeAlert(alertElement);
        }, 5000);
    }
}

function removeAlert(alert) {
    alert.style.opacity = "0";
    setTimeout(function() { 
        alert.style.display = "none"; 
        alert.remove();
    }, 600);
}

if(window.navigator.userAgent.includes("Windows") && !window.navigator.userAgent.includes("Edge")) {
    getDataWait("ignoreIE.php", function(response) {
        if(response == "false") {
            window.location.href = "/pages/ie";
        }
    });
}