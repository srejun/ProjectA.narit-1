

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


app.get('/api',function(req,res){
    var date = new Date()
    var day = date.getUTCFullYear()
    var time = date.getTime()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var alltime = "hour"+"minute"+"second"
    console.log(date)
    console.log(date.toLocaleTimeString())
    console.log(""+hour+minute+second)
    
    res.end("test time")
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
    
    if(req.body['location']===undefined||req.body['inBuilding']===undefined||req.body['data']===undefined){
        res.end("ERROR")
        throw("ERROR")
    }
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var myobj = req.body
        
        var date = new Date()
        var time = date.getTime()
        myobj['data'].time = date
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        var alltime = "hour"+"minute"+"second"
        //console.log("this time "+time)
        //console.log("this count"+hour+minute+second)
        //console.log("all time "+alltime)
        //var dbo = db.db("DataSensor");
        //console.log(myobj)
        
            dbo.collection("from").find({location: req.body['location'],inBuilding: req.body['inBuilding']}).toArray(function(err, result) {
                if (err) throw err;
                if(result.length>0)
                {
                    MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    let  newdata ={}
                    newdata['location'] = req.body['location']
                    newdata['inBuilding'] = req.body['inBuilding']
                    newdata['data'] = [{'uv':req.body['data']['uv'],'wind':req.body['data']['wind'],'humidity':req.body['data']['humidity'],'temperature':req.body['data']['temperature'],'time':date}]
                    var dbo = db.db("DataSensor");
                    var adddata = {$push:{data:newdata.data[0]}}
                    //console.log(result)
                    //console.log(req.body['data'])
                    
                    dbo.collection("from").update({location: req.body['location'],inBuilding: req.body['inBuilding']},adddata, function(err, res) {
                        if (err) throw err;
                        //console.log(JSON.stringify(result[0]['data'][0])+"path "+res);
                        db.close();
                    });
                    })
                }
                else{
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("DataSensor");
                    let  newdata ={}
                    newdata['location'] = req.body['location']
                    newdata['inBuilding'] = req.body['inBuilding']
                    newdata['data'] = [{'uv':req.body['data']['uv'],'wind':req.body['data']['wind'],'humidity':req.body['data']['humidity'],'temperature':req.body['data']['temperature'],'time':date}]
                    //var adddata = {$set}
                    dbo.collection("from").insertOne(newdata, function(err, res) {
                        if (err) throw err;
                        console.log("1 document insert");
                        db.close();
                    });
                })
                }
                
                console.log("result from db"+JSON.stringify(result));
                //console.log("11111"+hasplace) 
                db.close();
                
            });
        })
            
        
            /* if(hasplace){
                
            }
               
            console.log("this data"+data)
            
            
        
        
        
        
        
        console.log(data)
        console.log("2222222"+hasplace)  */
    //});
    res.end("OKKKKK")
})



var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Application run at http://%s:%s", host, port)
})