var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    var value = { confirm: false, err: '', data: null }

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
                var result = await dbo.collection(req.body['location']).find({ inBuilding: req.body['inBuilding'], date: { $gte: new Date("2018/" + req.body['month'] + "/1 00:00:00").getTime(), $lt: new Date("2018/" + (parseInt(req.body['month']) + 1).toString() + "/1 00:00:00").getTime() } }).toArray()
                console.log(result.length)
                if (result.length <= 0) {
                    value.err = 'no data'
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
                    for (var i = 0; i < result.length; i++) {
                        console.log(new Date(result[i].date).toDateString() + " " + result[i].ave[0].uv)
                        form.humid.push(result[i].ave[0].humidity)
                        form.time.push(new Date(result[i].date).toLocaleDateString())
                        form.uv.push(result[i].ave[0].uv)
                        form.wind.push(result[i].ave[0].wind)
                        form.tmp.push(result[i].ave[0].temperature)
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

//,$gte:new Date("2018"+":"+req.body['month']+":1 00:00:00").getTime()  $gte:new Date("2018"+":"+parseInt(req.body['month'])+":1 00:00:00").getTime(),