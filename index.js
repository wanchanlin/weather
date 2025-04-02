//import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const trakt = require("./components/trakt/api");
const weather = require("./components/weather/earth");
const mars = require("./components/weather/mars");


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
  response.render("movie", { trendingMovies: movies });
});
app.get("/movie/:imdb/studios", async (request, response) => {
  console.log(request.params.imdb); //request.params contains any url placeholders (e.g. :imdbId is a placeholder named imdbId)
  let studios = await trakt.getStudiosByMovieId(request.params.imdb);
  //console.log(studios);
  response.render("studios", { movieStudios: studios });
});

app.get('/', (req, res) => {
  res.render('index');
});
app.get("/mars-weather", async (req, res) => {
  try {
      const weatherData = await mars.getMarsWeather();
      res.render("mars-weather", { weatherData });
  } catch (error) {
      console.error("Error fetching Mars weather:", error); // Log the whole error object
      res.status(500).send("Could not retrieve Mars weather data.");
  }
});
app.get('/weather', (req, res) => {
  res.render('index');
});
app.get('/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;
    // Fetch both datasets in parallel
    const [earthData, marsData] = await Promise.all([
      weather.getWeatherByCity(city),
      mars.getMarsWeather()
    ]);
    
    res.render("weather", { 
      earthWeather: earthData,
      marsWeather: marsData,
      city: city
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
});
app.use(express.urlencoded({ extended: true })); // Add this near the top of your file with other middleware

app.post('/weather', (req, res) => {
  const city = req.body.city;
  res.redirect(`/weather/${city}`);
});
// app.get("/:city", async (req, res) => {
// console.log("Weather route hit");
//   try {
//     const city = req.params.city;
//     console.log(city);
//     const weatherData = await weather.getWeatherByCity(city);
//     res.render("weather", { weatherData: weatherData, city: city });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Could not retrieve weather data.");
//   }
// });


//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});


