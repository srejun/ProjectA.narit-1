var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    var date = new Date()
    var value = { confirm: false, datas: [] }

    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID }).toArray()

        if (have_ses.length > 0){
            value.datas = await dbo.collection("location").find({}).toArray()
            value.confirm = true
        }
        console.log(value)
        res.end(JSON.stringify(value))
        db.close();
    });

}