var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['data'] === undefined|| req.body['date'] === undefined) {
        res.end("ERROR")
        throw ("ERROR")
    }
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var myobj = req.body
        var date = new Date()
        //var time = date.getTime()
        myobj['data'].time = time
        
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        
        var alltime = new Date(req.body['date'])
        var year = alltime.getFullYear()
        var month = alltime.getMonth()
        var day = alltime.getDate()
        var sum = year+"/"+(month+1)+"/"+(day+1)
        var checktime = new Date(sum)
        var time = new Date(alltime).getTime()
        console.log(alltime)
        console.log(time)
        //console.log(req.body['data']['uv'])

        if (req.body['data']['uv'] === undefined) { req.body['data']['uv'] = 0 }
        //console.log(req.body['data']['uv'])
        if (req.body['data']['wind'] === undefined) { req.body['data']['wind'] = 0 }
        //console.log(req.body['data']['wind'])
        if (req.body['data']['humidity'] === undefined) { req.body['data']['humidity'] = 0 }
        //console.log(req.body['data']['humidity'])
        if (req.body['data']['temperature'] === undefined) { req.body['data']['temperature'] = 0 }
        //console.log(req.body['data']['temperature'])
        let newdata = {}
        newdata['location'] = req.body['location']
        newdata['inBuilding'] = req.body['inBuilding']
        newdata['rate'] = 5
        newdata['date'] = alltime.getTime()
        newdata['data'] = [{ 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time }]

        dbo.collection("from").find({ location: req.body['location'], inBuilding: req.body['inBuilding'], date: newdata['date'] }).toArray(function (err, result) {
            if (err) throw err;
            /* if(result.length>0){
                console.log(result[0].date)
                console.log(checktime.getTime())
            } */

            if (result.length > 0 && result[0].date < checktime.getTime()) {

                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("DataSensor");
                    var adddata = { $push: { data: newdata.data[0] } }
                    dbo.collection("from").update({ location: req.body['location'], inBuilding: req.body['inBuilding'] }, adddata, function (err, res) {
                        if (err) throw err;
                        console.log("1 document update");
                        db.close();
                    });
                })
            }
            else {
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("DataSensor");
                    dbo.collection("from").insertOne(newdata, function (err, res) {
                        if (err) throw err;
                        console.log("1 document insert");
                        db.close();
                    });
                })
            }
            db.close();
        });
    })
    res.end("OKKKKK")
}