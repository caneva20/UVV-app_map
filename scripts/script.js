onload = init;

let latEl;
let longEl;
let descEl;
let imgEl;

let mymap;

function init() {
    latEl = document.getElementById("lat");
    longEl = document.getElementById("long");
    descEl = document.getElementById("desc");
    imgEl = document.getElementById("img");

    mymap = L.map('mapid').setView([51.505, -0.09], 13);

    navigator.geolocation.getCurrentPosition(pos => {
        updateCurrentPosition(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiY2FuZXZhMjAiLCJhIjoiY2p3a2lycDVqMm9sZjQ5cXJwY2JzbXcxaSJ9.UGvCqSkzLwrouKUGXUhOTQ'
    }).addTo(mymap);

    registerListeners();
}

function registerListeners() {
    const btnAdd = document.getElementById("btn_add");

    btnAdd.addEventListener("click", btnAddLocation);
    mymap.on("click", onMapClicked);
}

function btnAddLocation() {
    const lat = latEl.value;
    const long = longEl.value;
    const desc = descEl.value;
    const img = imgEl.value;

    addLocation(lat, long, desc, img);
    moveView(lat, long);
}

function onMapClicked(e) {
    latEl.value = e.latlng.lat;
    longEl.value = e.latlng.lng;
}

function updateCurrentPosition(lat, long, accuracy) {
    moveView(lat, long);
    addLocation(lat, long, "Your current position", undefined, accuracy);
}

function moveView(lat, long) {
    mymap.setView([lat, long]);
}

function addLocation(lat, long, title, imgSrc, accuracy) {
    const pos = [lat, long];

    let marker = L.marker(pos);
    marker.addTo(mymap);

    if (title !== undefined || imgSrc !== undefined) {
        let html = "";

        if (title !== undefined) {
            html += `<h6>${title}</h6>`;
        }

        if (imgSrc !== undefined) {
            html += `<img src="${imgSrc}" height="50", width="50"/>`;
        }

        marker.bindPopup(html);
    }

    if (accuracy !== undefined) {
        L.circle(pos, {
            color: "red",
            fillColor: "#f03",
            fillOpacity: .5,
            radius: accuracy
        }).addTo(mymap);
    }
}