var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
const location = require('./location')
var data = new location
MongoClient.connect(url, function (err, db) {
    
        if (err) throw err
        console.log(data.addlo())
        var dbo = db.db("DataSensor");
        var location = data.addlo()
        var myobj = {location}
        console.log(myobj)
        dbo.collection("location").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 location insert");
            db.close();
        });

    
})
