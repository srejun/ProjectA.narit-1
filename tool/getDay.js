var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    var value = { confirm: false, err: '', data: null }

    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['typedate'] === undefined) {
        value.err = 'no filter'
    }
    else {
        MongoClient.connect(url, async function (err, db) {
            if (err) throw err;

            var dbo = db.db("DataSensor");
            var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID }).toArray()

            if (have_ses.length <= 0) {
                value.err = 'permission denied'
                console.log(value)
                res.end(JSON.stringify(value))
            }
            else {
                var form = {
                    humid: [],
                    uv: [],
                    tmp: [],
                    wind: [],
                    time: []
                }
                var tmp_time = new Date(req.body['typedate'] + " " + "00:00:00 ").getTime()
                var result = await dbo.collection(req.body['location']).find({ inBuilding: req.body['inBuilding'], date: tmp_time }).toArray()
                if (result.length <= 0) {
                    value.err = 'no data'
                    console.log(value)
                    res.end(JSON.stringify(value))
                }
                else {
                    var timenow = result[0].data[result[0].data.length - 1].time
                    var d_f = new Date(req.body['typedate'] + " " + "00:00:00 ").getTime()
                    var d_t = new Date(req.body['typedate'] + " " + "23:59:59 ").getTime()
                    var h_t = 0, uv_t = 0, tmp_t = 0, wind_t = 0, round = 0;

                    for (var i = 0; i < result[0].data.length; i++) {
                        h_t += result[0].data[i].humidity
                        uv_t += result[0].data[i].uv
                        tmp_t += result[0].data[i].temperature
                        wind_t += result[0].data[i].wind
                        round++;
                        if (((new Date(result[0].data[i].time).getTime() - new Date(result[0].data[0].time).getTime()) % 1800000) == 0) {
                            form.humid.push(h_t / round)
                            form.time.push(new Date(result[0].data[i].time).toLocaleTimeString())
                            form.uv.push(uv_t / round)
                            form.wind.push(wind_t / round)
                            form.tmp.push(tmp_t / round)
                            h_t = 0
                            uv_t = 0
                            tmp_t = 0
                            wind_t = 0
                            round = 0;
                        }
                    }
                    value['data'] = form
                    value['confirm'] = true
                    console.log(value)
                    res.end(JSON.stringify(value))
                }
            }
            db.close()
        });
    }
}