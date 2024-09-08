const apiKey = '265da18a677f4b19996134425240709';
const apiURL = 'https://api.weatherapi.com/v1/current.json';

async function getWeather(city) {
    try {
        const response = await fetch(`${apiURL}?key=${apiKey}&q=${city}`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById('searchBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city === '') {
        alert('Please enter a city name.');
        return;
    }
    const weather = await getWeather(city);
    if (weather) {
        displayWeather(weather);
        updateRecentCities(city);
    }
});

function displayWeather(weather) {
    const weatherDiv = document.getElementById('weatherData');
    weatherDiv.innerHTML = `
        <h2 class="text-2xl font-bold">${weather.location.name}</h2>
        <img src="${weather.current.condition.icon}" alt="${weather.current.condition.text}" class="mx-auto">
        <p>Temperature: ${weather.current.temp_c}°C</p>
        <p>Humidity: ${weather.current.humidity}%</p>
        <p>Wind Speed: ${weather.current.wind_kph} kph</p>
    `;
}

async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`${apiURL}?key=${apiKey}&q=${latitude},${longitude}`);
            const data = await response.json();
            displayWeather(data);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

document.getElementById('currentLocationBtn').addEventListener('click', getWeatherByLocation);

let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

function updateRecentCities(city) {
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
    displayRecentCities();
}

function displayRecentCities() {
    const dropdown = document.getElementById('recentCitiesDropdown');
    dropdown.innerHTML = recentCities.map(city => `<option value="${city}">${city}</option>`).join('');
}

document.getElementById('cityInput').addEventListener('input', displayRecentCities);

async function getExtendedForecast(city) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`);
    const data = await response.json();
    displayExtendedForecast(data);
}

function displayExtendedForecast(data) {
    const forecastDiv = document.getElementById('extendedForecast');
    forecastDiv.innerHTML = data.forecast.forecastday.map(day => `
        <div class="forecast-item">
            <p>${new Date(day.date).toLocaleDateString()}</p>
            <p>Temp: ${day.day.avgtemp_c}°C</p>
            <p>Wind: ${day.day.maxwind_kph} kph</p>
            <p>Humidity: ${day.day.avghumidity}%</p>
        </div>
    `).join('');
}

document.getElementById('extendedForecastBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city === '') {
        alert('Please enter a city name.');
        return;
    }
    await getExtendedForecast(city);
});
