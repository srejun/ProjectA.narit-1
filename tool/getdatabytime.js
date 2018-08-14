var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    let myobj = {}
    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['ftime'] === undefined || req.body['ttime'] === undefined) {
        res.end("ERROR")
        throw ("ERROR")
    }
    var mysort = { location: 1 };
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        dbo.collection("from").find({ location: req.body['location'], inBuilding: req.body['inBuilding'] }).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result)
            //console.log(result[0].data.length)

            for (var i = 0; i < result[0].data.length; i++) {
                if (result[0].data[i].time >= req.body['ftime'] && result[0].data[i].time <= req.body['ttime']) {
                    myobj[i] = result[0].data[i]
                }
            }
            console.log(myobj)
            res.end(JSON.stringify(myobj))
        });
    });
}