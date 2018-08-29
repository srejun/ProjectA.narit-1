var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("DataSensor");
    var havelo = {}
    dbo.collection("location").find({}).toArray(function (err, result) {
        if (err) throw err;
        //console.log(result);
        console.log(result[0].location.length)
        for (var i = 0; i < result[0].location.length; i++) {
            console.log(result[0].location[i].location)
            if (result[0].location.length > 0) {
                //console.log("Scan")
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    dbo.createCollection("A", function (err, res) {
                        if (err) throw err;
                        console.log("Collection created!");
                        db.close();
                    });
                });

            }

        }
        db.close();
    });
});
