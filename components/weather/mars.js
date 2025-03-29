const fetch = require("node-fetch");

const NASA_API_KEY = process.env.NASA_API_KEY;
const MARS_WEATHER_URL = `https://api.nasa.gov/insight_weather/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`;

async function getMarsWeather() {
  if (!NASA_API_KEY) {
    throw new Error("NASA API key is not set.");
  }

  let response = await fetch(MARS_WEATHER_URL);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch Mars weather data: ${errorData.message}`);
  }

  return await response.json();
}

module.exports = {
  getMarsWeather,
};
