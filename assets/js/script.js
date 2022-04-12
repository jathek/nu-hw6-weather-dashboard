const apiOpenWeather = "9696e5041f086f68c81a5f683ef01308";
let cityData;

let cityName;
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
searchForm.addEventListener("submit", citySearch);
function citySearch(event) {
  event.preventDefault();
  cityName = searchInput.value.trim();
  storeSearch(cityName);
  getWeather();
  searchForm.reset();
}

function getWeather() {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiOpenWeather}
    `
  )
    .then((response) => response.json())
    .then((geoData) => {
      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${geoData[0].lat}&lon=${geoData[0].lon}&units=imperial&appid=${apiOpenWeather}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      cityData = data;
      setWeatherVars(data);
      writeWeatherVars();
    });
}

// getWeather("San Antonio");
let cityTemp;
let cityWind;
let cityHumidity;
let cityUV;
let cityForecast;
function setWeatherVars(data) {
  cityTemp = data.current.temp + " °F";
  cityWind = data.current.wind_speed + " MPH";
  cityHumidity = data.current.humidity + "%";
  cityUV = data.current.uvi.toFixed(2);
  cityForecast = data.daily;
  console.log(
    `Name: ${cityName}, Temp: ${cityTemp}, Wind: ${cityWind}, Humidity: ${cityHumidity}, UV: ${cityUV}`
  );
}

function writeWeatherVars() {
  const currentInfo = document.querySelector("#cityDetails");
  currentInfo.innerHTML = `<h2>${cityName}</h2><p>Temp: ${cityTemp}</p><p>Wind: ${cityWind}</p><p>Humidity: ${cityHumidity}</p><p>UV Index: <span id="uv"> ${cityUV}</span></p>`;
  const forecastDays = document.querySelector("#forecastDays");
  forecastDays.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    let castDay = cityForecast[i];
    let castDate = castDay.dt;
    let castIcon = castDay.weather[0].icon;
    let castTemp = `${castDay.temp.max} °F / ${castDay.temp.min} °F`;
    let castWind = castDay.wind_speed + " MPH";
    let castHumid = castDay.humidity + "%";
    let castDayDate = new Date(castDay.dt * 1000);
    let castDayYear = castDayDate.getFullYear();
    let castDayMonth = `0${castDayDate.getMonth() + 1}`;
    let castDayDay = castDayDate.getDate();
    forecastDays.innerHTML += `<div class="daycast"><h4>${castDayYear}/${castDayMonth.slice(
      -2
    )}/${castDayDay}</h4><img src="http://openweathermap.org/img/wn/${castIcon}@2x.png" alt="a small icon depicting the forecasted day's conditions"><p>Temp: ${castTemp}</p><p>Wind: ${castWind}</p><p>Humidity: ${castHumid}</p></div>`;
  }
}

// set weatherSearches from localStorage
let weatherSearches = JSON.parse(localStorage.getItem("weatherSearches"));
if (weatherSearches === null) {
  weatherSearches = [];
}

function storeSearch(search) {
  // current search lowercased and stored as var
  let searchToStore = search.toLowerCase();
  // current search added to beginning of stored array
  weatherSearches.unshift(searchToStore);
  // remove duplicates
  weatherSearches = [...new Set(weatherSearches)];
  // submit to localStorage
  localStorage.setItem("weatherSearches", JSON.stringify(weatherSearches));
}
