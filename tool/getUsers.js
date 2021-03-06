exports.go = function (req, res) {
    const MongoClient = require('mongodb').MongoClient
    const url = require("../config").url
    const col_ses = "Sessions"
    const col_user = "user"
    const DB = "DataSensor"
    var value = { confirm: false, err: null, datas: [] }
    var have_ses = null
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        have_ses = await dbo.collection(col_ses).find({ session_id: req.sessionID, isAdmin: true }).toArray()
        if (have_ses.length <= 0) {
            value.err = "permission denied"
            console.log(value);
            res.end(JSON.stringify(value));
        }
        else {
            await dbo.collection(col_user).find({ status: true }).project({ _id: 0, PASS: 0 }).toArray(function (err, result) {
                if (err) throw err;
                value.confirm = true
                value.datas = result
                console.log(value);
                res.end(JSON.stringify(value));
            });
        }
        db.close();
    })
}