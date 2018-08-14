var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
   
        if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['typedate'] === undefined) {
            res.end("ERROR")
            throw ("ERROR")
        }
    
    
    
    
    
    
    
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("DataSensor");
            var mysort = {
    
                time: 1
    
            }
            dbo.collection("from").find({
                location: req.body['location'],
                inBuilding: req.body['inBuilding']
            }).toArray(function (err, result) {
                if (err) throw err;
    
    
    
             
    
               var d_f =new Date("Tue Aug 14 2018 13:33:03 GMT+0700 (SE Asia Standard Time)").getTime()
               var d_t =new Date("Tue Aug 15 2018 12:06:03 GMT+0700 (SE Asia Standard Time)").getTime()
               
             
                var form = {
                    humid:[],
                    uv:[],
                    tmp:[],
                    wind:[],
                    time:[]
                }
                var bs = function (t) {
                    var s = 0;
                    var e = result[0].data.length - 1;
                    while (s != (e - 1)) {
                        var m = parseInt((s + e) / 2);
                        if (t === result[0].data[m].time) {
                            s = m;
                            break;
                        } else if (t < result[0].data[m].time) e = m
                        else if (t > result[0].data[m].time) s = m
                    }
                    return s;
    
                }; 
                 var st = bs(d_f)
               var en = bs(d_t)
                for(var i =st;i<en;i++)
                {
                        form.humid.push(result[0].data[i].humidity)
                        form.time.push(new Date(result[0].data[i].time).toLocaleString())
                        form.uv.push(result[0].data[i].uv)
                        form.wind.push(result[0].data[i].wind)
                        form.tmp.push(result[0].data[i].temperature)
                }
                console.log(JSON.stringify(form))
    
                
                res.end(JSON.stringify(form))
            });
        });
  
}