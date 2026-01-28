const apiKey = '914254454ca488d913232fffe6d35533';

const searchBtn = document.querySelector('#search-btn');
const cityInput = document.querySelector('#city-input');
const locateBtn = document.querySelector('#locate-btn');
const suggestionsDiv = document.querySelector('#suggestions');
const themeToggle = document.querySelector('#theme-toggle');

const cities = [
  'București',
  'Cluj-Napoca',
  'Iași',
  'Timișoara',
  'Brașov',
  'Constanța'
];

async function checkWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ro&appid=${apiKey}`
  );
  const data = await res.json();
  updateUI(data);
}

function updateUI(data) {
  document.querySelector('#city-name').textContent = data.name;
  document.querySelector('#temp').textContent =
    Math.round(data.main.temp) + '°C';

  document.querySelector('#desc').textContent =
    data.weather[0].description;

  document.querySelector('#humidity').textContent =
    data.main.humidity + '%';

  document.querySelector('#wind').textContent =
    data.wind.speed + ' km/h';

  document.querySelector('#weather-icon').src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.querySelector('#google-map').src =
    `https://www.google.com/maps?q=${data.coord.lat},${data.coord.lon}&output=embed`;
}

cityInput.addEventListener('input', () => {
  const value = cityInput.value.toLowerCase();

  const matches = cities.filter(c =>
    c.toLowerCase().startsWith(value)
  );

  suggestionsDiv.innerHTML = matches
    .map(c => `<div class="suggestion-item">${c}</div>`)
    .join('');

  suggestionsDiv.classList.toggle('active', matches.length > 0);
});

suggestionsDiv.addEventListener('click', e => {
  if (e.target.classList.contains('suggestion-item')) {
    cityInput.value = e.target.textContent;
    suggestionsDiv.classList.remove('active');
    checkWeather(e.target.textContent);
  }
});

searchBtn.addEventListener('click', () => {
  if (cityInput.value) checkWeather(cityInput.value);
});

locateBtn.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(pos => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&lang=ro&appid=${apiKey}`
    )
      .then(r => r.json())
      .then(updateUI);
  });
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
});
