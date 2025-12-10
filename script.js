// Initialize map centered on Romania
var map = L.map('map').setView([45.9432, 24.9668], 7);

// Load map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

let marker;

// Search city
function searchCity() {
    const city = document.getElementById("search").value;

    if (!city) return;

    // 1. Get coordinates from Nominatim (free)
    fetch(`https://nominatim.openstreetmap.org/search?city=${city}&country=Romania&format=json`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                alert("Orașul nu a fost găsit!");
                return;
            }

            const lat = data[0].lat;
            const lon = data[0].lon;

            // Move map to city
            if (marker) map.removeLayer(marker);
            marker = L.marker([lat, lon]).addTo(map);
            map.setView([lat, lon], 11);

            // 2. Get weather from Open-Meteo
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                .then(res => res.json())
                .then(weatherData => {
                    const w = weatherData.current_weather;

                    document.getElementById("weather").innerHTML = `
                        <h2>${city}</h2>
                        <p>Temperatură: ${w.temperature}°C</p>
                        <p>Vânt: ${w.windspeed} km/h</p>
                        <p>Vreme: ${w.weathercode}</p>
                    `;
                });
        });
}
