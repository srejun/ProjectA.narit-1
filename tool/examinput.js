var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go=function(req,res){
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
}