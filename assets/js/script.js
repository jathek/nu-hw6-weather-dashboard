const apiOpenWeather = "9696e5041f086f68c81a5f683ef01308";
let cityData;
// set weatherSearches from localStorage
let weatherSearches = JSON.parse(localStorage.getItem("weatherSearches"));
const previousSearches = document.querySelector("#previousSearches");
if (weatherSearches === null) {
  weatherSearches = [];
} else {
  writePrev();
}

// accept searches from user
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
searchForm.addEventListener("submit", citySearch);
function citySearch(event) {
  event.preventDefault();
  let cityName = searchInput.value.trim();
  /* call store and get functions while ignoring empty input */
  if (Number(cityName.length) !== 0) {
    storeSearch(cityName);
    getWeather(cityName);
    writePrev();
  }
  searchForm.reset();
}

/* fetch data from omdb */
function getWeather(cityName) {
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
      writeWeather(data, cityName);
    });
}

/* write data to page */
function writeWeather(data, cityName) {
  /* current weather vars */
  let cityTemp = data.current.temp + " °F";
  let cityWind = data.current.wind_speed + " MPH";
  let cityHumidity = data.current.humidity + "%";
  let cityDayDate = new Date(data.current.dt * 1000);
  let cityDayYear = cityDayDate.getFullYear();
  let cityDayMonth = `0${cityDayDate.getMonth() + 1}`;
  cityDayMonth = cityDayMonth.slice(-2);
  let cityDayDay = `0${cityDayDate.getDate()}`;
  cityDayDay = cityDayDay.slice(-2);
  let cityIcon = data.current.weather[0].icon;
  let cityUV = data.current.uvi.toFixed(2);
  let uvColor = "uvPurple";
  /* color uv conditionally */
  if (cityUV < 3) {
    uvColor = "uvGreen";
  } else if (cityUV < 6) {
    uvColor = "uvYellow";
  } else if (cityUV < 8) {
    uvColor = "uvOrange";
  } else if (cityUV < 11) {
    uvColor = "uvRed";
  }
  const currentInfo = document.querySelector("#cityDetails");
  currentInfo.innerHTML = `<h2><span class="capitalCase">${cityName}</span> (${cityDayYear}/${cityDayMonth}/${cityDayDay})</h2><img id="currentIcon" src="http://openweathermap.org/img/wn/${cityIcon}@2x.png" alt="a small icon depicting the current day's conditions"><p>Temp: ${cityTemp}</p><p>Wind: ${cityWind}</p><p>Humidity: ${cityHumidity}</p><p>UV Index: <span class="${uvColor}"> ${cityUV}</span></p>`;
  /* forecast writing */
  let cityForecast = data.daily;
  const forecastDays = document.querySelector("#forecastDays");
  forecastDays.innerHTML = "";
  /* loop over forecast for 5 days */
  for (let i = 1; i < 6; i++) {
    let castDay = cityForecast[i];
    let castIcon = castDay.weather[0].icon;
    let castTempHi = `${castDay.temp.max} °F`;
    let castTempLow = `${castDay.temp.min} °F`;
    let castWind = castDay.wind_speed + " MPH";
    let castHumid = castDay.humidity + "%";
    let castDayDate = new Date(castDay.dt * 1000);
    let castDayYear = castDayDate.getFullYear();
    let castDayMonth = `0${castDayDate.getMonth() + 1}`;
    castDayMonth = castDayMonth.slice(-2);
    let castDayDay = `0${castDayDate.getDate()}`;
    castDayDay = castDayDay.slice(-2);
    forecastDays.innerHTML += `<div class="daycast"><h4>${castDayYear}/${castDayMonth}/${castDayDay}</h4><img src="http://openweathermap.org/img/wn/${castIcon}@2x.png" alt="a small icon depicting the forecasted day's conditions"><p>High: ${castTempHi}</p><p>Low: ${castTempLow}</p><p>Wind: ${castWind}</p><p>Humidity: ${castHumid}</p></div>`;
  }
}

/* write buttons for previous searches */
function writePrev() {
  getWeather(weatherSearches[0]);
  previousSearches.innerHTML = "";
  for (let i = 0; i < 8 && i < weatherSearches.length; i++) {
    previousSearches.innerHTML += `<button class="capitalCase">${weatherSearches[i]}</button>`;
  }
  previousSearches.addEventListener("click", prevSearch);
}

/* function for click listener on previous search buttons */
function prevSearch(event) {
  if (event.target.matches("button")) {
    prevCityName = event.target.innerText;
    storeSearch(prevCityName);
    getWeather(prevCityName);
  }
}

/* store user searches in localstorage */
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
