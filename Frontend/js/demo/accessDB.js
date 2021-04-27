const {MongoClient} = require('mongodb');
const urlDB = "mongodb://localhost:27017/";

async function accessDBUtil(accessor){
  try
  {
    MongoClient.connect(urlDB, async function(err, db)
          {
            if (err) throw err;
            var dbo = db.db("WeatherDB");
            threeDayForecast = await dbo.collection("ThreeDayForecast").find({}).toArray();
            //this successfully queries the database and returns an array of .json objects
            accessor.set3day(threeDayForecast);
            hourlyForecast = await dbo.collection("HourlyForecast").find({}).toArray();
            accessor.setHourly(hourlyForecast);
            db.close();
            //here the value of accessor.threeDayForecast is an array of 3 .json objects
            //console.log(accessor.threeDayForecast[0]);
          });
    
  }
  
  catch{
    console.log("Error accessing mongoDB")
  }
  //here the value of accessor.threeDayForecast is undefined;
}


function accessDB(){
  var accessor = new dbAccessor();
  accessDBUtil(accessor);
  setTimeout(function(){
    for (day in accessor.threeDayForecast){
      console.log(accessor.threeDayForecast[day]["condition"]["text"]);
    }
    for (hour in accessor.hourlyForecast){
      console.log(accessor.hourlyForecast[hour]["time"]);
    }
  }, 150);
  return accessor;
}

//accesses the database to store objects
class dbAccessor{
  constructor()
  {
    this.threeDayForecast = [];
    this.hourlyForecast = [];
  }
  set3day(array){
    this.threeDayForecast = array;
  }
   setHourly(array){
     this.hourlyForecast = array;
   }
}

export{accessDB as accessDB,
    dbAccessor as dbAccessor};