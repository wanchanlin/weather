const fetch = require("node-fetch");
// import fetch from "node-fetch";

const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather";

async function getWeatherByCity(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY; // API key from environment variables
  if (!apiKey) {
    throw new Error("API key for OpenWeather is not set.");
  }

  const reqUrl = `${weatherBaseUrl}?q=${city}&appid=${apiKey}&units=metric`;
  let response = await fetch(reqUrl);
  console.log(response);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch weather data: ${errorData.message}`);
  }
  return await response.json();
}

module.exports = {
  getWeatherByCity
};