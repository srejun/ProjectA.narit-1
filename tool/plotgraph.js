var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {

    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['typedate'] === undefined) {
        res.end("ERROR")
        throw ("ERROR")
    }




    //
    var value = {}
    var notfind = {}
    notfind['data']={undefined}
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var have_ses= await dbo.collection(col_ses).find({session_id:String(req.sessionID)}).toArray() 
        var mysort = {
            time: 1
        }
        var result = await dbo.collection(req.body['location']).find({
            inBuilding: req.body['inBuilding'],date:req.body['typedate']
        }).toArray()
        console.log(result)
        console.log(result.hasOwnProperty(0))
        if (result.hasOwnProperty(0)===false) {
            res.end(undefined)
        }
        else {
            var timenow = result[0].data[result[0].data.length - 1].time
            var d_f = new Date(req.body['typedate'] + " " + "00:00:00 ").getTime()
            var d_t = new Date(req.body['typedate'] + " " + "23:59:59 ").getTime()
            var h_t = 0, uv_t = 0, tmp_t = 0, wind_t = 0, round = 0;
            var form = {
                humid: [],
                uv: [],
                tmp: [],
                wind: [],
                time: []
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
            for (var i = 0; i < result[0].data.length; i++) {
                h_t += result[0].data[i].humidity
                uv_t += result[0].data[i].uv
                tmp_t += result[0].data[i].temperature
                wind_t += result[0].data[i].wind
                round++;
                if (((new Date(result[0].data[i].time).getTime() - new Date(result[0].data[0].time).getTime()) % 1800000) == 0) {
                    form.humid.push(h_t / (round * 1000))
                    form.time.push(new Date(result[0].data[i].time).toLocaleTimeString())
                    form.uv.push(uv_t / (round * 1000))
                    form.wind.push(wind_t / (round * 1000))
                    form.tmp.push(tmp_t / (round * 1000))
                    h_t = 0
                    uv_t = 0
                    tmp_t = 0
                    wind_t = 0
                    round = 0;
                }
            }
            if(have_ses.length>0){
                value={confirm:true,data:max}
                res.end(JSON.stringify(value))
            }
            else{
                value={confirm:false,data:null}
                res.end(JSON.stringify(value))
            }
        }

    });

}