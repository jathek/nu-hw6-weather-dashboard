let apiOpenWeather = "9696e5041f086f68c81a5f683ef01308";
let cityData;

function getWeather(search) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${search}&appid=${apiOpenWeather}
    `
  )
    .then((response) => response.json())
    .then((geoData) => {
      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${geoData[0].lat}&lon=${geoData[0].lon}&appid=${apiOpenWeather}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      cityData = data;
      // console.log(data);
      // weatherP.innerText = "City: " + data.city.name;
    });
}
getWeather("New York City");
let cityName;
let cityTemp;
let cityWind;
let cityHumidity;
let cityUV;
let cityForecast;
