//import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const trakt = require("./components/trakt/api");
const weather = require("./components/weather/weather"); //

//set up Express app
const app = express();
const port = process.env.PORT || 8889;

//define important folders
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//setup public folder
app.use(express.static(path.join(__dirname, "public")));

//PAGE ROUTES
app.get("/movie", async (request, response) => {
  let movies = await trakt.getTrendingMovies();
  console.log(movies);
  response.render("index", { trendingMovies: movies });
});
app.get("/movie/:imdb/studios", async (request, response) => {
  console.log(request.params.imdb); //request.params contains any url placeholders (e.g. :imdbId is a placeholder named imdbId)
  let studios = await trakt.getStudiosByMovieId(request.params.imdb);
  //console.log(studios);
  response.render("studios", { movieStudios: studios });
});
// New route to display weather
// app.get("/weather/:city", async (req, res) => {
//   const city = req.params.city;
//   const weatherData = await weather.getWeatherByCity(city);
//   res.render("weather", { weatherData: weatherData, city: city });
// });
app.get("/:city", async (req, res) => {
console.log("Weather route hit");
  try {
    const city = req.params.city;
    console.log(city);
    const weatherData = await weather.getWeatherByCity(city);
    res.render("weather", { weatherData: weatherData, city: city });
  } catch (error) {
    console.error(error);
    res.status(500).send("Could not retrieve weather data.");
  }
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});


