const apiKey = 'YOUR_API_KEY';
const apiURL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(city){
    const response = await fetch(`${apiURL}?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}