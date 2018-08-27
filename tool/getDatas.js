var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    var date = new Date()
    var value = { confirm: false, datas: [] }
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
                        time: null
                    }, outdoor: {
                        uv: 0,
                        temperature: 0,
                        humidity: 0,
                        wind: 0,
                        time: null
                    }
                }

                if (indoor.length > 0) data.indoor = indoor[0].data[indoor[0].data.length - 1]
                if (outdoor.length > 0) data.outdoor = outdoor[0].data[outdoor[0].data.length - 1]

                datas.push(data)
            }
            value.confirm = true
            value.datas = datas
            res.end(JSON.stringify(value))
        }
        db.close();

    });
}