const apiKey = '265da18a677f4b19996134425240709';
const apiURL = 'https://api.weatherapi.com/v1/current.json';

// Show loading indicator
function showLoading() {
    const weatherDiv = document.getElementById('weatherData');
    weatherDiv.innerHTML = `<p class="text-blue-500">Loading...</p>`;
}

// Hide loading indicator
function hideLoading() {
    const weatherDiv = document.getElementById('weatherData');
    weatherDiv.innerHTML = '';
}

// Fetch weather data for a given city
async function getWeather(city) {
    showLoading();
    try {
        const response = await fetch(`${apiURL}?key=${apiKey}&q=${city}`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        hideLoading();
        return data;
    } catch (error) {
        hideLoading();
        displayError(error.message);
    }
}

// Display error messages to the user
function displayError(message) {
    const weatherDiv = document.getElementById('weatherData');
    weatherDiv.innerHTML = `<p class="text-red-500">${message}</p>`;
}

// Display weather data
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

// Fetch weather data based on user's current location
async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`${apiURL}?key=${apiKey}&q=${latitude},${longitude}`);
            const data = await response.json();
            displayWeather(data);
        }, () => {
            displayError('Unable to retrieve your location.');
        });
    } else {
        displayError('Geolocation is not supported by this browser.');
    }
}

// Event listener for the search button
document.getElementById('searchBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city === '') {
        displayError('Please enter a city name.');
        return;
    }
    const weather = await getWeather(city);
    if (weather) {
        displayWeather(weather);
        updateRecentCities(city);
    }
});

// Event listener for the current location button
document.getElementById('currentLocationBtn').addEventListener('click', getWeatherByLocation);

let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

// Update the list of recent cities
function updateRecentCities(city) {
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
    displayRecentCities();
}

// Display the recent cities in a dropdown menu
function displayRecentCities() {
    const dropdown = document.getElementById('recentCitiesDropdown');
    dropdown.innerHTML = recentCities.map(city => `<option value="${city}">${city}</option>`).join('');
}

// Fetch and display extended weather forecast
async function getExtendedForecast(city) {
    showLoading();
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`);
        if (!response.ok) throw new Error('Unable to fetch extended forecast');
        const data = await response.json();
        hideLoading();
        displayExtendedForecast(data);
    } catch (error) {
        hideLoading();
        displayError(error.message);
    }
}

// Display extended weather forecast data
function displayExtendedForecast(data) {
    const forecastDiv = document.getElementById('extendedForecast');
    forecastDiv.innerHTML = data.forecast.forecastday.map(day => `
        <div class="forecast-item bg-gray-200 p-2 rounded mb-2">
            <p class="font-bold">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="mx-auto">
            <p>Temp: ${day.day.avgtemp_c}°C</p>
            <p>Wind: ${day.day.maxwind_kph} kph</p>
            <p>Humidity: ${day.day.avghumidity}%</p>
        </div>
    `).join('');
}

// Event listener for the extended forecast button
document.getElementById('extendedForecastBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city === '') {
        displayError('Please enter a city name.');
        return;
    }
    await getExtendedForecast(city);
});
