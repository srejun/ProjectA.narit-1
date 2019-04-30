var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    var value = []

    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var datas = await dbo.collection("Train").find({}).toArray()


        console.log(value)
        res.end(JSON.stringify(datas))

        db.close();
    });
}
