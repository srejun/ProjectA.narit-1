var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    var date = new Date()
    var value = { confirm: false, err: '', datas: [] }
    var datas = []

    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID }).toArray()
        if (have_ses.length <= 0) {
            res.end(JSON.stringify(value))
        }
        else {
            var locations = await dbo.collection("location").find({}).toArray()
            for (var i = 0; i < locations.length; i++) {
                //var findkey = await dbo.collection("location").find({location: req.body['location']}).toArray()
                var indoor = await dbo.collection(locations[i].key).find({ inBuilding: true }).toArray()
                var outdoor = await dbo.collection(locations[i].key).find({ inBuilding: false }).toArray()
                var data = {
                    location: locations[i].location, indoor: {
                        uv: 0,
                        temperature: 0,
                        humidity: 0,
                        wind: 0,
                        time: null,
                        flag: null
                    }, outdoor: {
                        uv: 0,
                        temperature: 0,
                        humidity: 0,
                        wind: 0,
                        time: null,
                        flag: null
                    }
                }

                if (indoor.length > 0) {
                    data.indoor = indoor[indoor.length-1].data[indoor[indoor.length-1].data.length - 1]
                    if (data.indoor.humidity > 75) data.indoor.flag = 'dark'
                    else if (data.indoor.humidity > 70) data.indoor.flag = 'danger'
                    else if (data.indoor.humidity > 65) data.indoor.flag = 'warning'
                    else if (data.indoor.humidity > 60) data.indoor.flag = 'success'
                    else if (data.indoor.humidity > 55) data.indoor.flag = 'ligth'
                }
                if (outdoor.length > 0) {
                    data.outdoor = outdoor[outdoor.length-1].data[outdoor[outdoor.length-1].data.length - 1]
                    if (data.outdoor.humidity > 75) data.outdoor.flag = 'dark'
                    else if (data.outdoor.humidity > 70) data.outdoor.flag = 'danger'
                    else if (data.outdoor.humidity > 65) data.outdoor.flag = 'warning'
                    else if (data.outdoor.humidity > 60) data.outdoor.flag = 'success'
                    else if (data.outdoor.humidity > 55) data.outdoor.flag = 'ligth'
                }

                datas.push(data)
            }
            value.confirm = true
            value.datas = datas
            res.end(JSON.stringify(value))
        }
        db.close();

    });
}