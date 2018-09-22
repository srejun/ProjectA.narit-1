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
        }
        else {
            var result = await dbo.collection("location").find({ location: req.body['location'] }).toArray()
            if (result.length > 0) {
                if (result[0].status === true) {
                    value.err = 'Same Collection!'
                }
                else {
                    value.confirm = true;
                    await dbo.collection("location").updateOne({ location: req.body['location'], status: false }, { $set: { status: true } })
                }
            }
            else {
                value.confirm = true;
                const findlengthlo = await dbo.collection("location").find({}).toArray()
                keylocation = findlengthlo.length + 1
                await dbo.collection("location").insertOne({ location: req.body['location'], key: keylocation.toString(), status: true }, function (err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                });
                await dbo.createCollection(keylocation.toString(), function (err, res) {
                    if (err) throw err;
                    console.log("Collection created!");
                    db.close();
                });
                console.log(value);
                res.end(JSON.stringify(value));
            }

        }
        console.log(value);
        res.end(JSON.stringify(value));
    });
}