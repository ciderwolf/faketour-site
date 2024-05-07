let pages = {
    "Home": "/",
    "About": "/about/",
    "Events": "/events/",
    "Constructed": "/constructed/",
    "Matches": "/matches/"
};

async function loadMenu(activePage) {
    loadFooter(activePage);
    let div = document.getElementsByClassName("topnav")[0];
    div.id = "topnav";
    let response = await fetch("/php/user.php?page=menu");
    let login = await response.json();
    let loginPages;
    if(login == null) {
        loginPages = {
            "Sign In": "/account/login/?",
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

async function loadFooter(activePage) {
    const page = activePage.toLowerCase();
    let response = await fetch('/img/?artist=' + page);
    let artist = await response.json();
    if(artist) {
        let footer = document.getElementById('footer');
        let link = document.createElement('a');
        link.innerHTML = "Artwork by " + artist.name;
        link.href = artist.href;
        footer.appendChild(link);
    }
}

function showMenuItems() {
    let x = document.getElementById("topnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function showAlert(title, text, kind, timeout = false, lifespan = 5000) {
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
    if(timeout === true) {
        setTimeout(function() {
            removeAlert(alertElement);
        }, lifespan);
    }
}

function removeAlert(alert) {
    alert.style.opacity = "0";
    setTimeout(function() { 
        alert.style.display = "none"; 
        alert.remove();
    }, 600);
}