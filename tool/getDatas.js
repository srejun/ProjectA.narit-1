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
                new_obj.key = obj.key
                if (obj.indoor === undefined) {
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
                else {
                    new_obj.outdoor = obj.outdoor
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