var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    var value = { confirm: false, err: '', datas: [] }

    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID }).toArray()
        if (have_ses.length <= 0) {
            res.end(JSON.stringify(value))
        }
        else {
            var datas = await dbo.collection("location").find({}).toArray()

            value.datas = datas.map(function (obj) {
                var new_obj = {}
                new_obj.location = obj.location

                if (obj.indoor === undefined) {
                new_obj.key = obj.key
                    new_obj.indoor = {
                        uv: 0,
                        temperature: 0,
                        humidity: 0,
                        wind: 0,
                        time: null,
                        flag: null
                    }
                }
                else {
                    new_obj.indoor = obj.indoor
                }

                if (obj.outdoor === undefined) {
                    new_obj.outdoor = {
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

                return new_obj
            });

            value.confirm = true
            console.log(value)
            res.end(JSON.stringify(value))
        }
        db.close();
    });
}