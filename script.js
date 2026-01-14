const apiKey = '914254454ca488d913232fffe6d35533'; // Inlocuieste cu cheia ta API de la OpenWeatherMap
const searchBtn = document.querySelector('#search-btn');
const cityInput = document.querySelector('#city-input');
const locateBtn = document.querySelector('#locate-btn');

// Functia principala care aduce datele
async function checkWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ro&appid=${apiKey}`
        );
        
        if (!response.ok) throw new Error('Orasul nu a fost gasit');
        
        const data = await response.json();
        updateUI(data);
    } catch (err) {
        alert(err.message);
    }
}

// Logic pentru auto-locate
function getLocalWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ro&appid=${apiKey}`
            );
            const data = await res.json();
            updateUI(data);
        });
    }
}

// Aici trimitem datele catre front-end
function updateUI(data) {
    document.querySelector('#city-name').innerHTML = data.name;
    document.querySelector('#temp').innerHTML = Math.round(data.main.temp) + '°C';
    document.querySelector('#desc').innerHTML = data.weather[0].description;
    document.querySelector('#humidity').innerHTML = data.main.humidity + '%';
    document.querySelector('#wind').innerHTML = data.wind.speed + ' km/h';
}

// Events
searchBtn.addEventListener('click', () => {
    if (cityInput.value) checkWeather(cityInput.value);
});

locateBtn.addEventListener('click', getLocalWeather);

// Pornim cu locatia automata la inceput
window.onload = getLocalWeather;
