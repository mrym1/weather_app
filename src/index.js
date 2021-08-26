const http = require("http");
const fs = require("fs");
// const requests = require("requests");
const path = require('path');
const express = require('express');
const app = express();
const request = require("request");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates");

app.set("view engine", "hbs");

app.use(express.static(static_path));
app.set("views",templates_path);

app.get("/",(req, res) => {
  res.render("login");
})

app.post("/",(req, res) => {
  const city = req.body.send;
//  console.log(city);
 request(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=e500e16c6e7a46f7da2ce99ac36b9ac6`, (err, resp) => {
   if(err){
      res.render("error");
    }
  else{
    let B = JSON.parse(resp.body);
    // res.render("index",{obj: B});
    if (B.cod == '404') {
      res.status(404).render('error', {
          err: "Invalid City Name"
      });
    } 
    else {
        let weather = `http://openweathermap.org/img/w/${B.weather[0].icon}.png`;
        let D = "Night";
        let N = weather.includes("d");
        if (B.weather[0].icon == "01d") {
            weather = "images/sunny.png";
        } 
        else if (B.weather[0].icon == "01n") {
            weather = "images/night.png";
        }  
        else if (B.weather[0].main == "Smoke") {
          weather = "images/wind.png";
        } 
        else if (B.weather[0].main == "Rain") {
          weather = "images/rainy.png";
        } 
        else if (B.weather[0].main == "Haze") {
            weather = "images/haze.png";
        } 
        else if (B.weather[0].main == "Drizzle") {
            weather = "images/drizzle.png";
        }  
        else if (B.weather[0].main == "Clouds") {
          weather = "images/clouds.png";
        }
        else if (B.weather[0].main == "13d") {
          weather = "images/snow.png";
        }   
        else if (B.weather[0].main == "Mist") {
          weather = "images/mist.jpg";
        } 
        else if (B.weather[0].main == "Thunderstorm") {
            weather = "images/thunderstorm.png";
        }

        if (N == true) {
            D = "Day";
        }
        res.render('index', {
          obj: B,
          a1: weather,
          a2: D,
          a3: B.weather[0].main
       });
      }    
      // resp.end;
    }
  }
      )

  });

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
