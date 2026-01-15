const apiKey = '914254454ca488d913232fffe6d35533'; 
const searchBtn = document.querySelector('#search-btn');
const cityInput = document.querySelector('#city-input');
const locateBtn = document.querySelector('#locate-btn');
const suggestionsDiv = document.querySelector('#suggestions');

// Lista de orase din Romania pentru sugestii
const romanianCities = [
    'Iași', 'Ilfov', 'București', 'Cluj-Napoca', 'Timișoara', 'Constanța',
    'Craiova', 'Brașov', 'Galați', 'Ploiești', 'Oradea', 'Brăila',
    'Arad', 'Pitești', 'Sibiu', 'Bacău', 'Târgu Mureș', 'Baia Mare',
    'Buzău', 'Botoșani', 'Satu Mare', 'Râmnicu Vâlcea', 'Suceava',
    'Piatra Neamț', 'Drobeta-Turnu Severin', 'Focșani', 'Târgoviște',
    'Tulcea', 'Târgu Jiu', 'Bistrița', 'Slatina', 'Călărași', 'Reșița',
    'Alba Iulia', 'Deva', 'Hunedoara', 'Zalău', 'Sfântu Gheorghe',
    'Giurgiu', 'Slobozia', 'Vaslui', 'Roman', 'Turda', 'Mediaș',
    'Alexandria', 'Voluntari', 'Lugoj', 'Medgidia', 'Onești', 'Miercurea Ciuc'
];

// Functia principala care aduce datele
async function checkWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ro&appid=${apiKey}`
        );

        if (!response.ok) throw new Error('Orașul nu a fost găsit');

        const data = await response.json();
        updateUI(data);
    } catch (err) {
        alert(err.message);
    }
}

// Logic pentru auto-locate cu error handling imbunatatit
function getLocalWeather() {
    if (!navigator.geolocation) {
        alert('Geolocation nu este suportat de browser-ul tău');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ro&appid=${apiKey}`
                );
                
                if (!res.ok) throw new Error('Nu s-au putut obține datele meteo');
                
                const data = await res.json();
                updateUI(data);
            } catch (err) {
                alert('Eroare la obținerea vremii: ' + err.message);
            }
        },
        (error) => {
            let errorMsg = 'Nu s-a putut obține locația ta';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg = 'Acces la locație refuzat. Te rog activează permisiunea de locație.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg = 'Informația despre locație nu este disponibilă.';
                    break;
                case error.TIMEOUT:
                    errorMsg = 'Cererea de locație a expirat.';
                    break;
            }
            
            alert(errorMsg);
        }
    );
}

// Aici trimitem datele catre front-end
function updateUI(data) {
    document.querySelector('#city-name').innerHTML = data.name;
    document.querySelector('#temp').innerHTML = Math.round(data.main.temp) + '°C';
    document.querySelector('#desc').innerHTML = data.weather[0].description;
    document.querySelector('#humidity').innerHTML = data.main.humidity + '%';
    document.querySelector('#wind').innerHTML = data.wind.speed + ' km/h';
    updateMap(data.coord.lat, data.coord.lon, data.name);
}

// Functia pentru actualizarea hartii cu marker rosu
function updateMap(lat, lon, cityName) {
    const mapIframe = document.querySelector('#google-map');
    if (mapIframe) {
        // Folosim Google Maps Embed cu marker
        mapIframe.src = `https://www.google.com/maps?q=${lat},${lon}&output=embed&z=12`;
    }
}

// Functie pentru filtrarea sugestiilor
function filterCities(input) {
    const searchTerm = input.toLowerCase().trim();
    
    if (searchTerm.length < 2) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('active');
        return;
    }
    
    const matches = romanianCities.filter(city => 
        city.toLowerCase().startsWith(searchTerm)
    );
    
    if (matches.length > 0) {
        suggestionsDiv.innerHTML = matches
            .slice(0, 5)
            .map(city => `<div class="suggestion-item">${city}</div>`)
            .join('');
        suggestionsDiv.classList.add('active');
    } else {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('active');
    }
}

// Event pentru input - sugestii
cityInput.addEventListener('input', (e) => {
    filterCities(e.target.value);
});

// Event pentru click pe sugestie
suggestionsDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-item')) {
        cityInput.value = e.target.textContent;
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('active');
        checkWeather(e.target.textContent);
    }
});

// Inchide sugestiile cand dai click in afara
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('active');
    }
});

// Event pentru Enter key
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && cityInput.value) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('active');
        checkWeather(cityInput.value);
    }
});

// Events
searchBtn.addEventListener('click', () => {
    if (cityInput.value) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('active');
        checkWeather(cityInput.value);
    }
});

locateBtn.addEventListener('click', getLocalWeather);

// Pornim cu locatia automata la inceput
window.onload = getLocalWeather;
