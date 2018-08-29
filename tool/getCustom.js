var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    var value = { confirm: false, err: '', data: null }
    var all_date = []
    var data = []
    var form = {
        humid: [],
        uv: [],
        tmp: [],
        wind: [],
        time: []
    }

    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined) {
        value.err = 'no filter'
        res.end(JSON.stringify(value))
    }
    else {
        MongoClient.connect(url, async function (err, db) {
            var dbo = db.db("DataSensor");
            var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID }).toArray()
            if (have_ses.length <= 0) {
                value.err = 'permission denied'
                console.log(value)
                res.end(JSON.stringify(value))
            }
            else {
                var result = await dbo.collection(req.body['location']).find({ inBuilding: req.body['inBuilding'], date: { $gte: new Date(req.body['typedate'].split(" to ")[0]).getTime(), $lte: new Date(req.body['typedate'].split(" to ")[1]).getTime() } }).toArray()
                if (result.length <= 0) {
                    value.err = 'no data'
                    console.log(value)
                    res.end(JSON.stringify(value))
                }
                else {
                    var bs = function (t, i) {
                        var s = 0;
                        var e = result[i].data.length - 1;
                        while (s != (e - 1)) {
                            var m = parseInt((s + e) / 2);
                            if (t === result[i].data[s].time) return s
                            else if (t === result[i].data[e].time) return e
                            else if (t === result[i].data[m].time) return m
                            else if (t < result[i].data[m].time) e = m
                            else if (t > result[i].data[m].time) s = m
                        }
                        return s;
                    };
                    for (var i = 0; i < result.length; i++) {
                        new_d = new Date(result[i].date).toLocaleDateString()
                        var st = bs(new Date(new_d + " " + req.body['Ftime']).getTime(), i)
                        var en = bs(new Date(new_d + " " + req.body['Ttime']).getTime(), i)
                        var data = [0, 0, 0, 0,];
                        for (var j = st; j <= en; j++) {
                            data[0] += result[i].data[st].humidity
                            data[1] += result[i].data[st].temperature
                            data[2] += result[i].data[st].uv
                            data[3] += result[i].data[st].wind
                        }
                        for (var k = 0; k < data.length; k++) { data[k] = data[k] / (en - st + 1) }
                        form.humid.push(data[0])
                        form.time.push(new Date(result[i].date).toLocaleDateString())
                        form.uv.push(data[2])
                        form.wind.push(data[3])
                        form.tmp.push(data[1])
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

