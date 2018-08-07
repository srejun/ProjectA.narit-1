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

app.post('/api/getdbytime', function(req,res){ //api get data by parse value time
    console.log(req.body)
    if(req.body['date']===undefined||req.body['ftime']===undefined||req.body['ttime']===undefined){
        res.end("ERROR")
        throw("ERROR")
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        dbo.collection("from").find({date: req.body['date'],ftime: req.body['ftime'],ttime: req.body['ttime']}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          console.log("GET")
          res.end(JSON.stringify(result))
          db.close();
        });
    });
})



app.post('/api',function(req,res){ //
    console.log('data input'+req.body)
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



app.post('/api/inputdata', function(req,res){ //sensor input update data
    //console.log(req.body)
    var hasplace = false
    var data=null
    if(req.body['location']===undefined||req.body['inBuilding']===undefined||req.body['data']===undefined){
        res.end("ERROR")
        throw("ERROR")
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var myobj = req.body
        
        
        //var dbo = db.db("DataSensor");
            dbo.collection("from").find({location: req.body['location'],inBuilding: req.body['inBuilding']}).toArray(function(err, result) {
                if (err) throw err;
                hasplace = true
                data=result['data']
                console.log("result from db"+result);
                console.log("11111"+hasplace) 
                db.close();
            });   
        
            if(hasplace){
                dbo.collection("from").updateMany(data, req.body['data'], function(err, res) {
                    if (err) throw err;
                    console.log("1 document update");
                    db.close();
                });
            }
            else{
                dbo.collection("from").insertOne(myobj, function(err, res) {
                    if (err) throw err;
                    console.log("1 document insert");
                    db.close();
                });
            }
            
        
        
        
        
        
        console.log(data)
        console.log("2222222"+hasplace) 
    });
    res.end("OKKKKK")
})



var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Application run at http://%s:%s", host, port)
})