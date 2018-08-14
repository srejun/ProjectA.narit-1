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
            var timenow = result[0].data[result[0].data.length - 1].time
               var d_f =new Date(req.body['typedate']+" "+"00:00:00 ").getTime()
               var d_t =new Date(req.body['typedate']+" "+"23:59:59 ").getTime()  
               var h_t = 0,uv_t=0,tmp_t=0,wind_t=0,round = 0;
                var form = {
                    humid:[],
                    uv:[],
                    tmp:[],
                    wind:[],
                    time:[]
                }
            //     var bs = function (t) {
            //         var s = 0;
            //         var e = result[0].data.length - 1;
            //         while (s != (e - 1)) {
            //             var m = parseInt((s + e) / 2);
            //             if (t === result[0].data[m].time) {
            //                 s = m;
            //                 break;
            //             } else if (t < result[0].data[m].time) e = m
            //             else if (t > result[0].data[m].time) s = m
            //         }
            //         return s;
            //     }; 
            //    var st = bs(d_f)
            //    var en = bs(d_t)
                for(var i =0;i<result[0].data.length;i++)
                {
                    h_t += result[0].data[i].humidity
                    uv_t += result[0].data[i].uv
                    tmp_t += result[0].data[i].temperature
                    wind_t += result[0].data[i].wind
                    round ++ ;
                        if(  (   (new Date(result[0].data[i].time).getTime() - new Date(result[0].data[0].time).getTime()) %1800000)==0   )
                        {
                         form.humid.push(h_t/(round*1000))
                         form.time.push(new Date(result[0].data[i].time).toLocaleTimeString())
                         form.uv.push(uv_t/(round*1000))
                         form.wind.push(wind_t/(round*1000))
                         form.tmp.push(tmp_t/(round*1000))
                                h_t = 0
                                uv_t=0
                                tmp_t=0
                                wind_t=0
                                round = 0;
                        }
                }
                console.log(JSON.stringify(form))
                res.end(JSON.stringify(form))
            });
        });
  
}