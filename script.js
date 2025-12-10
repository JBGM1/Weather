// 1. Initialize map
let map = L.map('map').setView([45.9432, 24.9668], 7);

// 2. Add map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Marker
let marker = L.marker([45.9432, 24.9668]).addTo(map);

// ---------- SUGESTII ORAȘE ----------
document.getElementById("search").addEventListener("input", async function () {
    let query = this.value.trim();
    let suggestionBox = document.getElementById("suggestions");

    if (query.length < 2) {
        suggestionBox.innerHTML = "";
        return;
    }

    let url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=ro&format=json`;

    let response = await fetch(url);
    let data = await response.json();

    suggestionBox.innerHTML = "";

    if (!data.results) return;

    data.results.forEach(city => {
        let li = document.createElement("li");
        li.textContent = `${city.name}, ${city.country}`;
        li.onclick = () => selectCity(city);
        suggestionBox.appendChild(li);
    });
});

// ---------- SELECTAREA ORAȘULUI ----------
async function selectCity(city) {
    let lat = city.latitude;
    let lon = city.longitude;

    // Mută harta
    map.setView([lat, lon], 10);
    marker.setLatLng([lat, lon]);

    document.getElementById("suggestions").innerHTML = "";
    document.getElementById("search").value = city.name;

    // Preia vremea
    let weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;

    let res = await fetch(weatherURL);
    let meteo = await res.json();

    let w = meteo.current_weather;

    document.getElementById("temp").textContent = `Temperatură: ${w.temperature}°C`;
    document.getElementById("wind").textContent = `Vânt: ${w.windspeed} km/h`;
    document.getElementById("desc").textContent = `Cod vreme: ${w.weathercode}`;
}
