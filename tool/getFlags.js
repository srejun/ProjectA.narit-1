var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    var value = []

    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var datas = await dbo.collection("location").find({ status: true }).toArray()


        value = datas.map(function (obj) {
            var new_obj = {}

            new_obj.location = obj.location

            if (obj.outdoor === undefined) {
                new_obj.time = null
                new_obj.flag = 'secondary'
            }
            else {
                new_obj.time = obj.outdoor.time
                new_obj.flag = obj.outdoor.flag
            }

            return new_obj
        });

        console.log(value)
        res.end(JSON.stringify(value))

        db.close();
    });
}