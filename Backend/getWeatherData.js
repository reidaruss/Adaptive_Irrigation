const {MongoClient} = require('mongodb');
const urlDB = "mongodb://localhost:27017/";
const apiKey = "d73a7b2f43d545d696b181514213003";
const { json } = require('express');
const { each } = require('jquery');
const fetch = require('node-fetch');

async function get3day(location){    
    url_weather = (`http://api.weatherapi.com/v1/forecast.json?key=d73a7b2f43d545d696b181514213003&q=${location}&days=3&aqi=no&alerts=no`);
    fetch(url_weather)
    .then(
        function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
            response.status);
            return;
        }

        // Examine the text in the response
        response.json().then(function(data) {

            let Today = data["forecast"]["forecastday"][0]["day"];
            Today["date"] = data["forecast"]["forecastday"][0]["date"];
            Today["sunrise"] = data["forecast"]["forecastday"][0]["astro"]["sunrise"];
            Today["sunset"] = data["forecast"]["forecastday"][0]["astro"]["sunset"];
            Today["location"] = location;

            //hourlyToday is an array of JSON objects that contain weather data
            let hourlyToday = TodayDate = data["forecast"]["forecastday"][0]["hour"];

            let Tommorow =  data["forecast"]["forecastday"][1]["day"];
            Tommorow["date"] = data["forecast"]["forecastday"][1]["date"];
            Tommorow["sunrise"] = data["forecast"]["forecastday"][1]["astro"]["sunrise"];
            Tommorow["sunset"] = data["forecast"]["forecastday"][1]["astro"]["sunset"];
            Tommorow["location"] = location;

            let DayAfterTomorrow =  data["forecast"]["forecastday"][2]["day"];
            DayAfterTomorrow["date"] = data["forecast"]["forecastday"][2]["date"];
            DayAfterTomorrow["sunrise"] = data["forecast"]["forecastday"][2]["astro"]["sunrise"];
            DayAfterTomorrow["sunset"] = data["forecast"]["forecastday"][2]["astro"]["sunset"];
            DayAfterTomorrow["location"] = location;

            //threeDayForecast is an array of JSON objects that contain weather data
            let threeDayForecast = [Today, Tommorow, DayAfterTomorrow];
            
            //push to the weather collection database
            MongoClient.connect(urlDB, function(err, db) {
                if (err) throw err;
                var dbo = db.db("WeatherDB");
                dbo.dropCollection("ThreeDayForecast")
                dbo.collection("ThreeDayForecast").insertMany(threeDayForecast, function(err, res) {
                    if (err) throw err;
                    console.log("Number of documents inserted: " + res.insertedCount);
                    db.close();
                  });
               });

            //push to the hourly forecast database
            MongoClient.connect(urlDB, function(err, db) {
                if (err) throw err;
                var dbo = db.db("WeatherDB");
                dbo.dropCollection("HourlyForecast");
                dbo.collection("HourlyForecast").insertMany(hourlyToday, function(err, res) {
                  if (err) throw err;
                  console.log("Number of documents inserted: " + res.insertedCount);
                  db.close();
                });
               });
        });
        }
    )
    .catch(function(err) {
        console.log('Fetch Error :-S', err);
        return
    });
}




get3day("Dallas");

