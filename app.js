// const apiKey = 'd030ac84773f6c1da5dcb6a7fe964373';


// async function fetchWeatherData(cityName) {
//   try {
//     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${'d030ac84773f6c1da5dcb6a7fe964373'}`;
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     return null;
//   }
// }


// function updateWeatherUI(weatherData) {
//   if (!weatherData) {
//     console.log('Weather data not available');
//     return;
//   }

  
  
//   const temperature = weatherData.main.temp;
//   const feelsLike = weatherData.main.feels_like;
//   const humidity = weatherData.main.humidity;
//   const windSpeed = weatherData.wind.speed;
//   const city = weatherData.name;

//   document.querySelector('.temp').innerHTML = `${temperature}° <span class="temp-unit">F</span>`;
//   document.querySelector('.location').innerHTML = city;
//   document.querySelector('.feels .bold').innerHTML = `${feelsLike}°`;
//   document.querySelector('.humidity .bold').innerHTML = `${humidity}%`;
//   document.querySelector('.wind .bold').innerHTML = `${windSpeed} miles/hr`;
// }

// document.getElementById('search-form').addEventListener('submit', async function (event){
//   event.preventDefault();
//   const cityName = document.getElementById('city-input').value;
  
  
//   const weatherData = await fetchWeatherData(cityName);
  
//   updateWeatherUI(weatherData);
// });
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const cityNameUI = document.querySelector(".location");
const tempreature = document.querySelector(".temp");
const feelsLike = document.querySelector(".feels .bold");
const humidity = document.querySelector(".humidity .bold");
const wind = document.querySelector(".wind .bold");
const celciusBtn = document.querySelector(".celcius");
const farenheitBtn = document.querySelector(".farenheit");
const body = document.querySelector("body");
const checkbox = document.querySelector(".checkbox");
const modeBtn = document.querySelector(".mode");
let cityName = "";
let unit = "imperial";
let weatherData = null;
let isDarkMode = false;
console.log(isDarkMode);

const getCityTemp = async (cityName) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=45b6d1548d52a466627f72a82cb325e5&units=${unit}`
  );
  const data = await res.json();
  weatherData = data;
  renderElements(data);
};

const getCityPic = async (cityName) => {
  const res = await fetch(
    `https://api.unsplash.com/search/photos/?client_id=76lSVJPvbAXlVHOUl9Pnn4TQmrMWtjqXknZPgpAUEUI&query=${cityName}`
  );
  const data = await res.json();
  const url = data.results[1].urls.regular;
  body.style.backgroundImage = `url(${url})`;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  cityName = cityInput.value;
  getCityTemp(cityName);
  getCityPic(cityName);
});

celciusBtn.addEventListener("click", () => {
  farenheitBtn.classList.remove("active");
  celciusBtn.classList.add("active");
  unit = "metric";
  // getCityTemp(cityName);
  convertToMetric(weatherData);
});

const convertToMetric = (weatherData) => {
  const copy = JSON.parse(JSON.stringify(weatherData));
  copy.main.temp = Math.round(((weatherData.main.temp - 32) * 5) / 9);
  copy.main.feels_like = Math.round(
    ((weatherData.main.feels_like - 32) * 5) / 9
  );
  copy.wind.speed = Math.round(weatherData.wind.speed * 1.609);
  renderElements(copy);
};

farenheitBtn.addEventListener("click", () => {
  celciusBtn.classList.remove("active");
  farenheitBtn.classList.add("active");
  unit = "imperial";
  getCityTemp(cityName);
});

const renderElements = (data) => {
  let tempValue = unit === "imperial" ? "F" : "C";
  let speedValue = unit === "imperial" ? "miles/hr" : "km/hr";
  cityNameUI.innerHTML = data.name;
  tempreature.innerHTML = `${Math.round(
    data.main.temp
  )}° <span class="temp-unit">${tempValue}</span>`;
  feelsLike.innerText = `${Math.round(data.main.feels_like)}°`;
  humidity.innerText = `${data.main.humidity}%`;
  wind.innerText = `${data.wind.speed} ${speedValue}`;
};

checkbox.addEventListener("change", () => {
  localStorage.setItem("cityName", cityName);
});

window.addEventListener("DOMContentLoaded", () => {
  let city = localStorage.getItem("cityName");

  if (isDarkMode) {
    const body = document.querySelector("body");
    body.classList.add("dark-mode");
  }
  city ? city : (city = "New York");
  getCityTemp(city);
  getCityPic(city);
});

modeBtn.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  isDarkMode
    ? (modeBtn.innerText = "Light Mode")
    : (modeBtn.innerText = "Dark Mode");
  const body = document.querySelector("body");
  isDarkMode
    ? body.classList.add("dark-mode")
    : body.classList.remove("dark-mode");
  localStorage.setItem("isDarkMode", isDarkMode);
});
//task: implement dark mode btn, on click background pic should be multiple shades darker and btn name should change to 'light mode'. user should be able to toggle btw modes. Try to store this data in local storage.