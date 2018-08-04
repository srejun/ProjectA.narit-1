var express = require('express')
var bodyParser = require('body-parser')
var app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
var cors = require('cors')
var myobj
app.use(cors())

app.get('/show', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("weather");
    dbo.collection("data").findOne({}, {
      location: "B"
    })(function (err, result) {
      if (err) throw err;
      console.log("GET")
      console.log(result);

      res.end(JSON.stringify(result))
      db.close();
    });

  });

});
 

/* MongoClient.connect(url, function (err, mydb) {
  if (err) throw err
  var dbo = mydb.db("weather")
  var admin = 1
  if (admin) {
    if (1) {
  app.delete('/deluser', function(req,res){ 
  var myobj = req.body
 dbo.collection("user").deleteOne(myobj, function(err,result) {
   if (err) throw err
   console.log(req.body+" is deleted")
   res.end(JSON.stringify(req.body))
 })
   mydb.close();
 })
}}
})         
 */
 
MongoClient.connect(url, function (err, db) {
if (err) throw err
  var dbo = db.db("weather")
  var admin = 1
  if (admin) {
    if (1) {
    app.delete('/remove',function(req,res){
    var myobj = req.body
  dbo.collection("user").deleteOne(myobj, function(err,result) {
    if (err) throw err;
    console.log(myobj+" is deleted")
    res.end(JSON.stringify(myobj))
    })
         db.close();
    })
}}
  }) 
app.post('/register', function (req, res) {
  /* if(req.body['email']==undefined|req.body['name']==undefined|req.body['PASS']==undefined)
    {console.log(err);throw("ERROR")}  */
  var admin = 1
  if (admin) {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("weather");
      var myobj = req.body
      if (1) {
        dbo.collection("user").insertOne(myobj, function (err, result) {
          if (err) throw err;
          res.end(JSON.stringify(req.body))
        });
      }
      if (0) {
       /*  var myobj = {
          name: "Minnie"
        } */
        var newvalues = {
          $set: {
            PASS: "55555"
          }
        }
        dbo.collection("user").updateOne(myobj, newvalues, function (err, result) {
          if (err) throw err;
          res.end(JSON.stringify(req.body))

        });
      }

    console.log("ok")
    db.close();});  

  }
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Application run at http://%s:%s", host, port)
})

function newFunction(err) {
  if (err)
    throw err;
}
