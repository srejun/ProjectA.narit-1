var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    var date = new Date()
    var value = { confirm: false, locations: [] }

    MongoClient.connect(url, { useNewUrlParser: true }, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID }).toArray()

        if (have_ses.length > 0){
            value.locations = await dbo.collection("location").find({}).project({ _id: 0}).sort({ location: 1 }).toArray()
            value.confirm = true
        }
        res.end(JSON.stringify(value))
        db.close();
    });

}