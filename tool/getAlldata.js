var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor")
        var locations
        var datas = []
        var test = {}

        console.log(req.body.location)
        locations = await dbo.collection("location").find({ location: req.body.location, status: true }).toArray()
        test['location'] = locations[0].location
        test['key'] = locations[0].key
        if (locations[0].outdoor === undefined) test['flag'] = 'secondary'
        else test['flag'] = locations[0].outdoor.flag
        test['indoor'] = await dbo.collection(locations[0].key).find({ inBuilding: true }).toArray()
        test['outdoor'] = await dbo.collection(locations[0].key).find({ inBuilding: false }).toArray()
        res.end(JSON.stringify(test))
        /* if (req.body.location === undefined) {
            locations = await dbo.collection("location").find({ status: true }).toArray()
        }
        else {
            locations = await dbo.collection("location").find({ location: req.body.location, status: true }).toArray()
        }
        console.log(locations)

        for (var i = 0; i < locations.length; i++) {
            datas.push({})
            datas[i]['location'] = locations[i].location
            datas[i]['key'] = locations[i].key
            if (locations[i].outdoor === undefined) datas[i]['flag'] = 'secondary'
            else datas[i]['flag'] = locations[i].outdoor.flag
            datas[i]['indoor'] = await dbo.collection(locations[i].key).find({ inBuilding: true }).toArray()
            datas[i]['outdoor'] = await dbo.collection(locations[i].key).find({ inBuilding: false }).toArray()
        }
        //res.end('test')
        res.end(JSON.stringify({ result: datas }))
        //res.end(JSON.stringify(locations))
        db.close() */
    })
}