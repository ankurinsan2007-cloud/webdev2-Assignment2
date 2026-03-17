const API_KEY = "a6d33c42c42f7cd7aa93a115a6ac6fe0";
let consoleBox = document.getElementById("runtime-console");
let searchButton = document.getElementById("triggerSearch");
let cityInput = document.getElementById("userInputCity");

function addLog(message, type) {
    let time = new Date().toLocaleTimeString();
    let div = document.createElement("div");
    div.className = "log-entry type-" + type;
    div.innerHTML = "[" + time + "] " + message;
    consoleBox.appendChild(div);
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

async function getWeather(cityName) {
    let city = cityName || cityInput.value;
    if (city === "") return;
    consoleBox.innerHTML = "";

    addLog("START: Running code", "sync");
    setTimeout(function () {
        addLog("DELAYED: setTimeout ran", "macro");
    }, 0);
    Promise.resolve().then(function () {
        addLog("PRIORITY: Promise ran", "micro");
    });

    try {
        addLog("LOADING: Getting weather for " + city, "async");

        let url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + API_KEY;

        let res = await fetch(url);
        if (res.status !== 200) {
            throw new Error("City not found");
        }

        let data = await res.json();
        addLog("DONE: Got weather data", "async");

        document.getElementById("res-city").innerText = data.name + ", " + data.sys.country;
        document.getElementById("res-temp").innerText = Math.round(data.main.temp) + "°C";
        document.getElementById("res-cond").innerText = data.weather[0].description.toUpperCase();
        document.getElementById("res-hum").innerText = data.main.humidity + "%";
        document.getElementById("res-wind").innerText = data.wind.speed + " m/s";

        saveCity(city);
    } catch (err) {
        addLog("ERROR: " + err.message, "async");
        alert("Problem: " + err.message);
    }
    addLog("END: Code finished", "sync");
}

function saveCity(city) {
    let list = localStorage.getItem("lab2_cache");
    let cities = [];

    if (list !== null) {
        cities = JSON.parse(list);
    }

    if (cities.indexOf(city) === -1) {
        cities.unshift(city);
        if (cities.length > 5) {
            cities.pop();
        }
        localStorage.setItem("lab2_cache", JSON.stringify(cities));
        showHistory();
    }
}

function showHistory() {
    let box = document.getElementById("historyContainer");
    let list = localStorage.getItem("lab2_cache");
    let cities = [];

    if (list !== null) {
        cities = JSON.parse(list);
    }

    box.innerHTML = "";

    for (let i = 0; i < cities.length; i++) {
        let btn = document.createElement("button");
        btn.innerText = cities[i];
        btn.style.margin = "4px";
        btn.style.padding = "4px 8px";
        btn.style.cursor = "pointer";
        btn.style.background = "#222";
        btn.style.color = "#eee";
        btn.style.border = "1px solid #444";
        btn.style.borderRadius = "4px";

        btn.onclick = function () {
            getWeather(cities[i]);
        };

        box.appendChild(btn);
    }
}

searchButton.onclick = function () {
    getWeather();
};

window.onload = showHistory;