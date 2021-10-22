const mainContainer = document.querySelector(".container");
const cityName = document.querySelector(".title");
const weatherDescription = document.querySelector(".description");
const wHumidity = document.querySelector(".humidity");
const wPressure = document.querySelector(".pressure");
const wTemp = document.querySelector(".temp");
const wTemp_min = document.querySelector(".temp_min");
const wTemp_max = document.querySelector(".temp_max");
const weatherImg = document.getElementById("weatherImg");
//form input and button
const wForm = document.querySelector(".form");
const divForm = document.querySelector(".form-group");
const wInput = document.getElementById("city");
const currentWeatherBtn = document.getElementById("weather-btn");

// forecast button
const forecastBtn = document.getElementById("forecast-btn");
//error message

let msg = document.querySelector(".msg");

// console.log(msg);

//variables for weather, forecast and icons

let url_forecast_weather = `https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=London`;

let url_weather_icon_prefix = `http://openweathermap.org/img/w/10d.png`; // sufix .png

// console.log(url_weather_icon_prefix);

//function to get the values for the current weather based on API

function getWeatherNow(location) {
  let loc = location;
  let url_current_weather = `https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=${loc}`;

  // check if the API works
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url_current_weather, true);
  xhr.onload = function () {
    //check success status if not --> show error
    if (this.status === 200) {
      // let data = this.responseText;
      // data = JSON.parse(data);
      //   console.log(json);

      let data = JSON.parse(this.responseText);
      cityName.textContent = ` ${data.name}`;
      weatherDescription.textContent = `Description: ${data.weather[0].description}`;
      wHumidity.textContent = `Humidity: ${data.main.humidity}%`;
      wPressure.textContent = `Pressure: ${data.main.pressure} (hPa)`;
      wTemp.textContent = `Temp: ${Math.round(data.main.temp)}°`;
      wTemp_min.textContent = `Temp min: ${Math.round(data.main.temp_min)}°`;
      wTemp_max.textContent = `Temp max: ${Math.round(data.main.temp_max)}°`;
      weatherImg.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      // console.log(wTemp_max.textContent);
    } else {
      msg.textContent = "There was an error";
    }
  };
  xhr.send();
}
// getWeatherNow();

// show weather for London as default location
document.addEventListener("DOMContentLoaded", getWeatherNow("London"));

// add eventListener on the current weather button and get input values
let searchCity = wInput.value;
currentWeatherBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchCity = wInput.value;
  // console.log(searchCity);

  if (searchCity === "") {
    msg.textContent = "Please enter a city";
  } else if (searchCity !== "") {
    // msg.textContent = "";

    // transform first letter in a capital
    searchCity = searchCity.split("");
    searchCity[0] = searchCity[0].toUpperCase();
    searchCity = searchCity.join("");

    getWeatherNow(searchCity);
    //reset form and input
    // wForm.reset();
    // wInput.focus();
  } else {
    msg.textContent = "";
    wForm.reset();
    wInput.focus();
  }
});

forecastBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getForecast();
});

let city = ``;
function getForecast() {
  // console.log("here");
  let searchCity = wInput.value;
  const url = `https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=${searchCity}`;

  fetch(url)
    .then((response) => response.json())
    .then((forecastDays) => {
      let output = "";
      city = forecastDays.city.name;
      // console.log(city);

      // console.log("before loop");

      forecastDays.list.forEach((forecastDay) => {
        let currentHour = new Date(`${forecastDay.dt}` * 1000);
        let currentDate = new Date(`${forecastDay.dt}` * 1000);
        let currentMonth = new Date(`${forecastDay.dt}` * 1000);
        let currentYear = new Date(`${forecastDay.dt}` * 1000);

        output += `
        
        <div class="card-deck">
          <div class="card mb-2" style="width: 13rem">
            <center>
              <div class="card-body">
                <h5 class="card-title date">${currentDate.getDate(
                  forecastDay.dt * 1000
                )}/ ${
          currentMonth.getMonth(forecastDay.dt * 1000) + 1
        }/ ${currentYear.getFullYear(forecastDay.dt * 1000)}</h5>
                <img
                  src="http://openweathermap.org/img/w/${
                    forecastDay.weather[0].icon
                  }.png"
                  class="card-img-top"
                  alt="icon"
                  style="width: 100px; height: 100px"
                />
                <p class="card-text humidity">Hour: ${currentHour.getHours(
                  forecastDay.dt * 1000
                )}:00 </p>
                <p class="card-text temp">Temperature: ${Math.round(
                  forecastDay.main.temp
                )}°</p>
                <p class="card-text description">Description: ${
                  forecastDay.weather[0].description
                }</p>
              </div>
            </center>
          </div>
        </div>
        
      `;
      });
      document.querySelector(".weather-forecast").innerHTML = output;
      //reset form and input
      // wForm.reset();
      // wInput.focus();
    });
}
