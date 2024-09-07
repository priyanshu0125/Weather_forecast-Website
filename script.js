const apiKey = 'apiURL727d955510f0e308d2b1b70c4e6680af';
const apiURL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(city) {
    try {
        const response = await fetch(`${apiURL}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById('searchBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const weather = await getWeather(city);
    if (weather) {
        displayWeather(weather);
        updateRecentCities(city);
    }
});

function displayWeather(weather) {
    const weatherDiv = document.getElementById('weatherData');
    weatherDiv.innerHTML = `
        <h2 class="text-2xl font-bold">${weather.name}</h2>
        <p>Temperature: ${weather.main.temp}°C</p>
        <p>Humidity: ${weather.main.humidity}%</p>
        <p>Wind Speed: ${weather.wind.speed} m/s</p>
    `;
}

async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`${apiURL}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
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
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    displayExtendedForecast(data);
}

function displayExtendedForecast(data) {
    const forecastDiv = document.getElementById('extendedForecast');
    forecastDiv.innerHTML = data.list.map(item => `
        <div class="forecast-item">
            <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
            <p>Temp: ${item.main.temp}°C</p>
            <p>Wind: ${item.wind.speed} m/s</p>
            <p>Humidity: ${item.main.humidity}%</p>
        </div>
    `).join('');
}
