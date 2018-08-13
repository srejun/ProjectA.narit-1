var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
const delay = require('delay');

app.get('/api',function(req,res){ //test time
    var date = new Date()
    var day = date.getUTCFullYear()
    var time = date.getTime()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var alltime = "hour"+"minute"+"second"
    console.log(date)
    console.log(date.toLocaleTimeString())
    console.log(time)
    
    res.end("test time")
})


app.post('/api/getallsensor',function(req,res){ //get data all sensor
    var date = new Date()
    var mysort = { location: 1 };
    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        dbo.collection("from").find({}).sort(mysort).toArray(function(err, result) {
          if (err) throw err;
          /* console.log(result);
          console.log(result.length)
          console.log(result[0].data.length)
          console.log(result[1].data.length) */
          let max ={}
          //console.log(JSON.stringify(result[0].data[0]))
          for(var i=0;i<result.length;i++){
              max[i]={'location':result[i].location,'inBuilding':result[i].inBuilding,'data':result[i].data[0]}
              /* if(result[i].data[0].time.getTime()>max[i].data.time.getTime()){
                console.log(max[i].data.time.getTime())
                console.log(result[i].data[0].time.getTime())
              } */
              
            for(var j=0;j<result[i].data.length;j++){
                if(result[i].data[j].time>max[i].data.time){
                    max[i].data=result[i].data[j]
                }
            }
          }
          console.log(max)
          res.end(JSON.stringify(max))
          db.close();
        });
    });
    
})


app.post('/api/getdbytime', function(req,res){ //get data by parse value time
    let myobj={}
    if(req.body['location']===undefined||req.body['inBuilding']===undefined||req.body['ftime']===undefined||req.body['ttime']===undefined){
        res.end("ERROR")
        throw("ERROR")
    }
    var mysort = { location: 1 };
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        dbo.collection("from").find({location: req.body['location'],inBuilding: req.body['inBuilding']}).toArray(function(err, result) {
            if(err) throw err;
            //console.log(result)
            //console.log(result[0].data.length)
            
            for(var i=0;i<result[0].data.length;i++){
                if(result[0].data[i].time>=req.body['ftime']&&result[0].data[i].time<=req.body['ttime']){
                    myobj[i]=result[0].data[i]
                }
            }
            console.log(myobj)
            res.end(JSON.stringify(myobj))
        });
    });
})


app.post('/api/getgraph',function(req,res){ //get data plot graph
    if(req.body['location']===undefined||req.body['inBuilding']===undefined||req.body['typedate']===undefined){
        res.end("ERROR")
        throw("ERROR")
    }
    var date = "2018/08/13"
    var time = "14:00:00"
    var scale = new Date(date + " " + time).getTime()
    let timescale={}
    let meandata={}
    let sum={}
    let mean={}
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        dbo.collection("from").find({location: req.body['location'],inBuilding: req.body['inBuilding']}).toArray(function(err, result) {
            if(err) throw err;
            //console.log(result[0].data.length)
            var i=0
            //console.log(result[0].data[0].uv)
                    
                    var count
                    var start=0
            for(var index=0;index<48;index++){
                count=0
                timescale[index]=scale
                    sum['uv']=0
                    sum['wind']=0
                    sum['humidity']=0
                    sum['temperature']=0
                    mean['uv']=0
                    mean['wind']=0
                    mean['humidity']=0
                    mean['temperature']=0
                    
                    for(i=start;i<result[0].data.length;i++){
                        //console.log(result[0].data[i].uv)
                        if(scale<result[0].data[i].time&&result[0].data[i].time<scale+1800000){
                            sum['uv']=sum['uv']+result[0].data[i].uv
                            sum['wind']=sum['wind']+result[0].data[i].wind
                            sum['humidity']=sum['humidity']+result[0].data[i].humidity
                            sum['temperature']=sum['temperature']+result[0].data[i].temperature
                            //console.log(sum['uv'])
                            res.end("work")
                            start++
                            count++
                            
                        }
                        //console.log(count)
                        
                    }
                    console.log(start)
                    //console.log(count)
                    mean['uv']=(sum['uv']/count)
                    mean['wind']=(sum['wind']/count)
                    mean['humidity']=(sum['humidity']/count)
                    mean['temperature']=(sum['temperature']/count)
                    meandata[index]=[{uv:mean['uv'],wind:mean['wind'],humidity:mean['humidity'],temperature:mean['temperature']}]
                
                
                
                scale+=1800000
            }
            console.log(timescale)
            console.log(meandata)
            
            res.end("response")
        });
    });
})


app.post('/api/graph', function (req,res) { //function test gar
    MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("DataSensor");
            dbo.collection("from").find(
              {}
            
        ).toArray(function (err, result) {
            if (err) throw err;
            var date = "2018/08/10"
            var time = "10:25:25"
            for (var i = 0; i <5; i++) {

               new Date(date + " " + time).getTime() / 1000
                   

                
              
            }
            
            db.close();
        });
    });
})


app.post('/api/testinput',function(req,res){ //demo input data sensor
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
        myobj['data'].time = time
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        var alltime = "hour"+"minute"+"second"
        if(req.body['data']['uv']===undefined){req.body['data']['uv']=0}
        if(req.body['data']['wind']===undefined){req.body['data']['wind']=0}
        if(req.body['data']['humidity']===undefined){req.body['data']['humidity']=0}
        if(req.body['data']['temperature']===undefined){req.body['data']['temperature']=0}
        let timenow
        dbo.collection("from").find({location: req.body['location'],inBuilding: req.body['inBuilding']}).toArray(function(err, result) {
            if (err) throw err;
            if(1){MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("DataSensor");
                console.log("res"+result[0].data.length)
               timenow=result[0].data[result[0].data.length-1].time
            console.log("time"+timenow)  
            
            for(i=0;i<2000;i++){
            timenow=timenow+(5000)
                req.body['data']['uv']=req.body['data']['uv']+1
                req.body['data']['wind']=req.body['data']['wind']+1
                req.body['data']['humidity']=req.body['data']['humidity']+1
                req.body['data']['temperature']=req.body['data']['temperature']+1
                let  newdata ={}
                    newdata['location'] = req.body['location']
                    newdata['inBuilding'] = req.body['inBuilding']
                    newdata['data'] = [{'uv':req.body['data']['uv'],'wind':req.body['data']['wind'],'humidity':req.body['data']['humidity'],'temperature':req.body['data']['temperature'],'time':timenow}]
                    var adddata = {$push:{data:newdata.data[0]}}
                    dbo.collection("from").update({location: req.body['location'],inBuilding: req.body['inBuilding']},adddata, function(err, res) {
                        if (err) throw err;    
                    });
            
        }
            })
                
             }
            else res.end("fff")
        });
        //console.log(timenow)
      db.close();
            
        })
    res.end("OKKKKK")
})


app.post('/api/inputdata', function(req,res){ //sensor input update data
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
        myobj['data'].time = time
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        var alltime = "hour"+"minute"+"second"
        //console.log(req.body['data']['uv'])
        
            if(req.body['data']['uv']===undefined){req.body['data']['uv']=0}
            //console.log(req.body['data']['uv'])
            if(req.body['data']['wind']===undefined){req.body['data']['wind']=0}
            //console.log(req.body['data']['wind'])
            if(req.body['data']['humidity']===undefined){req.body['data']['humidity']=0}
            //console.log(req.body['data']['humidity'])
            if(req.body['data']['temperature']===undefined){req.body['data']['temperature']=0}
            //console.log(req.body['data']['temperature'])
            let  newdata ={}
                    newdata['location'] = req.body['location']
                    newdata['inBuilding'] = req.body['inBuilding']
                    newdata['data'] = [{'uv':req.body['data']['uv'],'wind':req.body['data']['wind'],'humidity':req.body['data']['humidity'],'temperature':req.body['data']['temperature'],'time':time}]
            
            dbo.collection("from").find({location: req.body['location'],inBuilding: req.body['inBuilding']}).toArray(function(err, result) {
                if (err) throw err;
                if(result.length>0)
                {
                    MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("DataSensor");
                    var adddata = {$push:{data:newdata.data[0]}}
                    dbo.collection("from").update({location: req.body['location'],inBuilding: req.body['inBuilding']},adddata, function(err, res) {
                        if (err) throw err;
                        db.close();
                    });
                    })
                }
                else{
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("DataSensor");
                    dbo.collection("from").insertOne(newdata, function(err, res) {
                        if (err) throw err;
                        console.log("1 document insert");
                        db.close();
                    });
                })
                }
                db.close();  
            });
        })
    res.end("OKKKKK")
})


var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Application run at http://%s:%s", host, port)
})