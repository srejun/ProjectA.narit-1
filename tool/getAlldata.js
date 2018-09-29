var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor")
        var locations

        console.log(req.body.location)
        if (req.body.location === undefined) {
            locations = await dbo.collection("location").find({ status: true }).toArray()
        }
        else {
            locations = await dbo.collection("location").find({ location: req.body.location, status: true }).toArray()
        }
        console.log(locations)

        var datas = new Array(locations.length);

        for (var i = 0; i < locations.length; i++) {
            datas[i]['location'] = locations[i].location
            datas[i]['key'] = locations[i].key
            if(locations[i].outdoor===undefined) datas[i]['flag'] = 'secondary'
            else datas[i]['flag'] = locations[i].outdoor.flag
            datas[i]['indoor'] = await dbo.collection(locations[i].key).find({ inBuilding: true }).toArray()
            datas[i]['outdoor'] = await dbo.collection(locations[i].key).find({ inBuilding: false }).toArray()
            console.log(data)
        }
        res.end(JSON.stringify(datas))
        //res.end(JSON.stringify(locations))
        db.close()
    })
}