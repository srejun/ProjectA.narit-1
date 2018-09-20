var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    var value = { confirm: false, err: '', datas: [] }

    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID }).toArray()
        if (have_ses.length <= 0) {
            value.err = "permission denied"
        }
        else {
            var find = await dbo.collection("location").find({ location: req.body['location'], status: true }).toArray()
            if (find.length <= 0) {
                value.err = "no data"
            }
            else {
                await dbo.collection("location").updateOne({ location: req.body['location'], status: true }, { $set: { status: false } })
                value.confirm = true
            }
            console.log(value)
        }
        res.end(JSON.stringify(value))
        db.close()
    });
}