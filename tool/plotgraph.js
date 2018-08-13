var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go=function(req,res){
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
}