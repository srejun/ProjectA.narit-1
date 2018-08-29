var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
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
            var locations = await dbo.collection("location").find({}).project({ _id: 0 }).sort({ location: 1 }).toArray()
            for (var i = 0; i < locations.length; i++) {
                var indoor = await dbo.collection(locations[i].location).find({ inBuilding: true }).project({ _id: 0, date: 1, data: 1 }).sort({ date: -1 }).toArray()
                var outdoor = await dbo.collection(locations[i].location).find({ inBuilding: false }).project({ _id: 0, date: 1, data: 1 }).sort({ date: -1 }).toArray()
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
                    data.indoor = indoor[0].data[indoor[0].data.length - 1]
                    if (data.indoor.humidity > 75) data.indoor.flag = 'dark'
                    else if (data.indoor.humidity > 70) data.indoor.flag = 'danger'
                    else if (data.indoor.humidity > 65) data.indoor.flag = 'warning'
                    else if (data.indoor.humidity > 60) data.indoor.flag = 'success'
                    else if (data.indoor.humidity > 55) data.indoor.flag = 'ligth'
                }
                if (outdoor.length > 0) {
                    data.outdoor = outdoor[0].data[outdoor[0].data.length - 1]
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