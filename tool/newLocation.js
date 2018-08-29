var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID, isAdmin: true }).toArray()
        var value = { confirm: false, err: '' }
        if (have_ses.length <= 0) {
            value.err = 'permission denied'
            res.end(JSON.stringify(value));
        }
        else {
            dbo.collection("location").find({ location: req.body['location'] }).toArray(function (err, result) {
                if (err) throw err;
                if (result.length > 0) {
                    value.err = 'Same Collection!'
                    console.log("Same Collection!");
                    res.end(JSON.stringify(value));
                }
                else {
                    value.err = 'Same Collection!'
                    value.confirm = true;
                    dbo.collection("location").insertOne({ location: req.body['location'] }, function (err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");
                    });
                    dbo.createCollection(req.body['location'], function (err, res) {
                        if (err) throw err;
                        console.log("Collection created!");
                        db.close();
                    });
                    res.end(JSON.stringify(value));
                }
            });
        }
    });
}