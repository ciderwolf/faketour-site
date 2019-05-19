let pages = {
    "Home": "/",
    "About": "/about/",
    "Events": "/events/",
    "Constructed": "/constructed/",
    "Matches": "/matches/"
};

async function loadMenu(activePage) {
    let div = document.getElementsByClassName("topnav")[0];
    div.id = "topnav";
    let response = await fetch("/php/user.php?page=menu");
    let login = await response.json();
    let loginPages;
    if(login == null) {
        loginPages = {
            "Log In": "/account/login/?",
            "Create Account": "/account/create/?"
        };
    } else {
        loginPages = {"My Account": "/account/"};
        if(login.admin == true) {
            loginPages["Admin"] = "/admin/";
        }
    }
    for(page of Object.keys(pages)) {
        let name = page;
        let link = pages[name];
        let menuItem = document.createElement("a");
        if(activePage == name) {
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
        if(activePage == name) {
            menuItem.classList.add("active");
        } else {
            menuItem.href = link;
        }
        menuItem.innerHTML = name;
        menuItem.style.float = "right";
        div.appendChild(menuItem);
    }
    let show = document.createElement('a');
    show.href = 'javascript:void(0);';
    show.classList.add("icon");
    show.onclick = function(e) {
        showMenuItems();
    }
    show.innerHTML = "&#9776;";
    div.appendChild(show);
}

function showMenuItems() {
    let x = document.getElementById("topnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
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