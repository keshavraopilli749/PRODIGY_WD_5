const API_KEY = 'your_api_key'; // Replace with your OpenWeatherMap API key

const weatherIconMap = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Snow: '❄️',
  Thunderstorm: '⛈️',
  Drizzle: '🌦️',
};

async function fetchWeather(location) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
      fetchForecast(location);
    } else {
      alert(data.message || 'Unable to fetch weather data.');
    }
  } catch (error) {
    alert('An error occurred while fetching the weather data.');
  }
}

async function fetchForecast(location) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&cnt=5&appid=${API_KEY}`);
    const data = await response.json();

    if (response.ok) {
      displayForecast(data.list);
    } else {
      alert(data.message || 'Unable to fetch forecast data.');
    }
  } catch (error) {
    alert('An error occurred while fetching the forecast.');
  }
}

function displayWeather(data) {
  const weatherDiv = document.getElementById('weather');
  const city = document.getElementById('city');
  const description = document.getElementById('description');
  const temp = document.getElementById('temp');
  const humidity = document.getElementById('humidity');
  const wind = document.getElementById('wind');
  const visibility = document.getElementById('visibility');
  const iconDiv = document.querySelector('.weather-icon');

  city.textContent = data.name;
  description.textContent = data.weather[0].description;
  temp.textContent = `${data.main.temp}°C / ${(data.main.temp * 9 / 5 + 32).toFixed(1)}°F`;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} m/s`;
  visibility.textContent = `${data.visibility / 1000} km`;

  iconDiv.textContent = weatherIconMap[data.weather[0].main] || '🌈';
}

function displayForecast(forecast) {
  const forecastDiv = document.getElementById('forecast');
  forecastDiv.innerHTML = '';
  forecast.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleString('en-us', { weekday: 'short' });
    const forecastItem = `
      <div class="forecast-item">
        <p>${day}</p>
        <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
        <p>${item.main.temp_min.toFixed(1)}°C / ${item.main.temp_max.toFixed(1)}°C</p>
      </div>
    `;
    forecastDiv.innerHTML += forecastItem;
  });
}

document.getElementById('getWeather').addEventListener('click', () => {
  const location = document.getElementById('location').value;
  if (location) fetchWeather(location);
  else alert('Please enter a city name.');
});

document.getElementById('getLocation').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
    const data = await response.json();
    displayWeather(data);
    fetchForecast(data.name);
  }, () => alert('Unable to fetch your location.'));
});
