var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cors = require('cors')
var myobj
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"

app.post('/show', function(req,res){
    console.log(req.body)
    if(req.body['date']===undefined||req.body['ftime']===undefined||req.body['ttime']===undefined){
        res.end("ERROR")
        throw("ERROR")
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        dbo.collection("from").find({date: req.body['date'],ftime: req.body['ftime'],ttime: req.body['ttime']},).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          console.log("GET")
          res.end(JSON.stringify(result))
          db.close();
        });
    });
})

app.post('/register',function(req,res){
    console.log(req.body)
    if(req.body['date']===undefined||req.body['ftime']===undefined||req.body['ttime']===undefined){
        res.end("ERROR")
        throw("ERROR")
    }
    console.log(req.body)
    console.log('date is' + req.body['date'])
    console.log('ftime is' + req.body['ftime'])
    console.log('ttime is' + req.body['ttime'])
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var myobj = req.body 
        dbo.collection("from").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    res.end("OKKKKK")
})

var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Application run at http://%s:%s", host, port)
})