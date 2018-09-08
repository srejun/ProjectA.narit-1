var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['data'] === undefined || req.body['date'] === undefined) {
        res.end("ERROR")
        throw ("ERROR")
    }
    MongoClient.connect(url,async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var myobj = req.body
        var date = new Date()
        myobj['data'].time = time

        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()

        var alltime = new Date(req.body['date'])
        var year = alltime.getFullYear()
        var month = alltime.getMonth()
        var day = alltime.getDate()
        var sum = year + "/" + (month + 1) + "/" + (day + 1)
        var checktime = new Date(sum)
        var time = new Date(alltime).getTime()

        if (req.body['data']['uv'] === undefined) { req.body['data']['uv'] = 0 }
        if (req.body['data']['wind'] === undefined) { req.body['data']['wind'] = 0 }
        if (req.body['data']['humidity'] === undefined) { req.body['data']['humidity'] = 0 }
        if (req.body['data']['temperature'] === undefined) { req.body['data']['temperature'] = 0 }
        
        var aveuv = null
        var avewind = null
        var avehumidity = null
        var avetem = null
        let newdata = {}
        let currentdata = {}

        newdata['inBuilding'] = req.body['inBuilding']
        newdata['rate'] = 5
        newdata['date'] = alltime.getTime()
       
        if (req.body['data']['humidity'] > 75) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time ,'flag':'dark'}]
        else if (req.body['data']['humidity'] > 70) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time ,'flag':'danger'}]
        else if (req.body['data']['humidity'] > 65) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time ,'flag':'warning'}]
        else if (req.body['data']['humidity'] > 60) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time ,'flag':'success'}]
        else if (req.body['data']['humidity'] >= 55) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time ,'flag':'light'}]
        newdata['data'] = [{ 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time }]

        var keylocation = 1
        var newlo = {}
        newlo['location'] = req.body['location']
        var haslo = true
        const find = await dbo.collection("location").find({ location: req.body['location'] }).toArray()     //insert new location
        const findlengthlo = await dbo.collection("location").find({}).toArray()

        if (find.hasOwnProperty(0)) {

            if (find[0].location === req.body['location']) {
                haslo = false
                var indexlo = 0
            }

            if (haslo) {
                keylocation = findlengthlo.length + 1
                if (req.body['inBuilding']) {
                    await dbo.collection("location").insertOne({ location: req.body['location'], key: keylocation.toString(), indoor: currentdata.data[0] })
                }
                else {
                    await dbo.collection("location").insertOne({ location: req.body['location'], key: keylocation.toString(), outdoor: currentdata.data[0] })
                }
            }
            else {
                if (req.body['inBuilding']) {
                    var updatecurrentdata = { $set: { indoor: currentdata.data[0] } }

                    await dbo.collection("location").updateOne({ location: find[indexlo].location }, updatecurrentdata)
                }
                else {
                    var updatecurrentdata = { $set: { outdoor: currentdata.data[0] } }
                    await dbo.collection("location").updateOne({ location: find[indexlo].location }, updatecurrentdata)
                }
            }
        }
        else {
            keylocation = findlengthlo.length + 1
            if (req.body['inBuilding']) {
                await dbo.collection("location").insertOne({ location: req.body['location'], key: keylocation.toString(), indoor: currentdata.data[0] })
            }
            else {
                await dbo.collection("location").insertOne({ location: req.body['location'], key: keylocation.toString(), outdoor: currentdata.data[0] })
            }
        }

        const findkey = await dbo.collection("location").find({ location: req.body['location'] }).toArray()
        var result = await dbo.collection(findkey[0].key).find({ inBuilding: req.body['inBuilding'], date: newdata['date'] }).toArray()

        if (result.length > 0 && result[0].date < checktime.getTime()) {
            aveuv = ((result[0].data.length * result[0].ave[0].uv) + newdata.data[0].uv) / (result[0].data.length + 1)
            avewind = ((result[0].data.length * result[0].ave[0].wind) + newdata.data[0].wind) / (result[0].data.length + 1)
            avehumidity = ((result[0].data.length * result[0].ave[0].humidity) + newdata.data[0].humidity) / (result[0].data.length + 1)
            avetem = ((result[0].data.length * result[0].ave[0].temperature) + newdata.data[0].temperature) / (result[0].data.length + 1)
            newdata['ave'] = [{ 'uv': aveuv, 'wind': avewind, 'humidity': avehumidity, 'temperature': avetem }]

            var dbo = db.db("DataSensor");
            var adddata = { $push: { data: newdata.data[0] }, $set: { ave: newdata.ave } }
            await dbo.collection(findkey[0].key).update({ inBuilding: req.body['inBuilding'] }, adddata)
            console.log("1 document update");
        }
        else {
            newdata['ave'] = [{ 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'] }]

            var dbo = db.db("DataSensor");
            await dbo.collection(findkey[0].key).insertOne(newdata)
            console.log("1 document insert");
        }
        db.close();
    })
    res.end("OKKKKK")
}