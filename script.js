// API SETUP
const apiKey = 'YOUR_API_KEY';
const apiURL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(city){
    const response = await fetch(`${apiURL}?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}

// Location Based Forecast
document.getElementById('searchBtn').addEventListener('click', async() => {
    const city = document.getElementById('cityInput').value;
    const weather = await getWeather(city);
    displayWeather(weather);
});

function displayWeather(weather){
    const weatherDiv = document.getElementById('weatherData');
    weatherDiv.innerHTML = `
        <h2 class="text-2xl font-bold">${weather.name}</h2>
        <p>Temperature: ${weather.main.temp}°C</p>
        <p>Humidity: ${weather.main.humidity}%</p>
        <p>Wind Speed: ${weather.wind.speed} m/s</p>
    `;
}