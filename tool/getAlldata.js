var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor")
        var locations
        var datas = {}

        console.log(req.body.location)
        if (req.body.location === undefined) {
            locations = await dbo.collection("location").find({ status: true }).toArray()
        }
        else {
            locations = await dbo.collection("location").find({ location: req.body.location, status: true }).toArray()
        }
        console.log(locations)
        var data_str = '['
        for (var i = 0; i < locations.length; i++) {
            //datas.push({})
            /* datas['location'] = locations[i].location
            datas['key'] = locations[i].key
            if (locations[i].outdoor === undefined) datas['flag'] = 'secondary'
            else datas['flag'] = locations[i].outdoor.flag
            datas['indoor'] = await dbo.collection(locations[i].key).find({ inBuilding: true }).toArray()
            datas['outdoor'] = await dbo.collection(locations[i].key).find({ inBuilding: false }).toArray() */
            var flag = ''
            if (locations[i].outdoor === undefined) flag = 'secondary'
            else flag = locations[i].outdoor.flag
            var indoor = await dbo.collection(locations[i].key).find({ inBuilding: true }).toArray()
            var outdoor = await dbo.collection(locations[i].key).find({ inBuilding: false }).toArray()
            if(i<locations.length-1) data_str = data_str+'{"location":'+locations[i].location+',"key":'+locations[i].key+',"flag":'+flag+',"indoor":'+JSON.stringify(indoor)+',"outdoor":'+JSON.stringify(outdoor)+'},'
            else data_str = data_str+'{"location":'+locations[i].location+',"key":'+locations[i].key+',"flag":'+flag+',"indoor":'+JSON.stringify(indoor)+',"outdoor":'+JSON.stringify(outdoor)+'}]'
        }
        res.end(data_str)
        //res.end(JSON.stringify(datas))
        //res.end(JSON.stringify(locations))
        db.close()
    })
}