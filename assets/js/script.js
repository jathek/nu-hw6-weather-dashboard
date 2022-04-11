let apiOpenWeather = "9696e5041f086f68c81a5f683ef01308";
let cityData;

function getWeather(city) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiOpenWeather}
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
      setWeatherVars(city,data);
    });
}
getWeather("New York City");
let cityName;
let cityTemp;
let cityWind;
let cityHumidity;
let cityUV;
let cityForecast;

function setWeatherVars(city,data) {
  cityName = city
  cityTemp = data.current.temp + " °F"
  cityWind = data.current.wind_speed + " MPH"
  cityHumidity = data.current.humidity + "%"
  cityUV = data.current.uvi
  cityForecast = data.daily
  console.log(
    `Name: ${cityName}, Temp: ${cityTemp}, Wind: ${cityWind}, Humidity: ${cityHumidity}, UV: ${cityUV}`
  );
}

