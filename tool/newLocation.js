var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var keylocation = 1
        var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID, isAdmin: true }).toArray()
        var value = { confirm: false, err: '' }
        if (have_ses.length <= 0) {
            value.err = 'permission denied'
            console.log(value);
            res.end(JSON.stringify(value));
        }
        else {
            var result = await dbo.collection("location").find({ location: req.body['location'], status: true }).toArray()
            const findlengthlo = await dbo.collection("location").find({}).toArray()
            keylocation = findlengthlo.length + 1
            if (result.length > 0) {
                value.err = 'Same Collection!'
                console.log(value);
                res.end(JSON.stringify(value));
            }
            else {
                value.confirm = true;
                dbo.collection("location").insertOne({ location: req.body['location'], key: keylocation.toString(), status: true }, function (err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                });
                dbo.createCollection(keylocation.toString(), function (err, res) {
                    if (err) throw err;
                    console.log("Collection created!");
                    db.close();
                });
                console.log(value);
                res.end(JSON.stringify(value));
            }

        }
    });
}