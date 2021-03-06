var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['data'] === undefined || req.body['date'] === undefined) {
        res.end("ERROR")
        throw ("ERROR")
    }
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var myobj = req.body
        var date = new Date()
        //var time = date.getTime()
        myobj['data'].time = time

        var alltime = new Date(req.body['date'])
        var year = alltime.getFullYear()
        var month = alltime.getMonth()
        var day = alltime.getDate()
        var sum = year + "/" + (month + 1) + "/" + (day + 1)
        var checktime = new Date(sum)
        var time = new Date(alltime).getTime()
        console.log(alltime)
        console.log(time)

        if (req.body['data']['uv'] === undefined) { req.body['data']['uv'] = 0 }
        //console.log(req.body['data']['uv'])
        if (req.body['data']['wind'] === undefined) { req.body['data']['wind'] = 0 }
        //console.log(req.body['data']['wind'])
        if (req.body['data']['humidity'] === undefined) { req.body['data']['humidity'] = 0 }
        //console.log(req.body['data']['humidity'])
        if (req.body['data']['temperature'] === undefined) { req.body['data']['temperature'] = 0 }

        var aveuv = null
        var avewind = null
        var avehumidity = null
        var avetem = null
        let newdata = {}
        let currentdata = {}
        //newdata['location'] = req.body['location']
        newdata['inBuilding'] = req.body['inBuilding']
        newdata['rate'] = 5
        newdata['date'] = alltime.getTime()

        if (req.body['inBuilding']===false) {
            if (req.body['data']['humidity'] > 75) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time, 'flag': 'dark' }]
            else if (req.body['data']['humidity'] > 70) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time, 'flag': 'danger' }]
            else if (req.body['data']['humidity'] > 65) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time, 'flag': 'warning' }]
            else if (req.body['data']['humidity'] > 60) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time, 'flag': 'success' }]
            else currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time, 'flag': 'light' }]
        }
        else {
            currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time }]
        }
        newdata['data'] = [{ 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time }]

        var keylocation = 1
        var newlo = {}
        newlo['location'] = req.body['location']
        //datalo = { location: req.body['location'] }
        var haslo = true
        var hasinside = false
        const find = await dbo.collection("location").find({ location: req.body['location']}).toArray()     
        //insert new location
        const findlengthlo = await dbo.collection("location").find({}).toArray()

        if (find.hasOwnProperty(0) === true) {
            if (find[0].location === req.body['location']) {
                haslo = false
                var indexlo = 0
            }
            if (haslo) {
                //console.log("update "+findlengthlo.length)
                keylocation = findlengthlo.length + 1
                if (req.body['inBuilding'] === true) {
                    await dbo.collection("location").insertOne({ location: req.body['location'], key: keylocation.toString(), indoor: currentdata.data[0], status: true })
                }
                else {
                    await dbo.collection("location").insertOne({ location: req.body['location'], key: keylocation.toString(), outdoor: currentdata.data[0], status: true })
                }


            }
            else {
                if (req.body['inBuilding'] === true) {
                    var updatecurrentdata = { $set: { indoor: currentdata.data[0] } }
                    await dbo.collection("location").updateOne({ location: find[indexlo].location}, updatecurrentdata)
                }
                else {
                    var updatecurrentdata = { $set: { outdoor: currentdata.data[0] } }
                    await dbo.collection("location").updateOne({ location: find[indexlo].location}, updatecurrentdata)
                }

                //console.log("updatelo")

            }
        }
        else {

            //console.log("insert "+findlengthlo.length)
            //console.log(currentdata)
            keylocation = findlengthlo.length + 1
            if (req.body['inBuilding'] === true) {
                await dbo.collection("location").insertOne({ location: req.body['location'], key: keylocation.toString(), indoor: currentdata.data[0], status: true })
            }
            else {
                await dbo.collection("location").insertOne({ location: req.body['location'], key: keylocation.toString(), outdoor: currentdata.data[0], status: true })
            }
        }

        const findkey = await dbo.collection("location").find({ location: req.body['location']}).toArray()
        //console.log("kloc"+findkey[0].key)
        //
        var result = await dbo.collection(findkey[0].key).find({ inBuilding: req.body['inBuilding'], date: newdata['date'] }).toArray()
        /* if(result.length>0){
            console.log(result[0].date)
            console.log(checktime.getTime())
        } */

        if (result.length > 0 && result[0].date < checktime.getTime()) {
            //console.log(result[0])
            //console.log(result[0].data.length)
            //console.log(result[0].ave[0].uv)
            //console.log(newdata.data[0].uv)
            aveuv = ((result[0].data.length * result[0].ave[0].uv) + newdata.data[0].uv) / (result[0].data.length + 1)
            avewind = ((result[0].data.length * result[0].ave[0].wind) + newdata.data[0].wind) / (result[0].data.length + 1)
            avehumidity = ((result[0].data.length * result[0].ave[0].humidity) + newdata.data[0].humidity) / (result[0].data.length + 1)
            avetem = ((result[0].data.length * result[0].ave[0].temperature) + newdata.data[0].temperature) / (result[0].data.length + 1)
            newdata['ave'] = [{ 'uv': aveuv.toFixed(2), 'wind': avewind.toFixed(2), 'humidity': avehumidity.toFixed(2), 'temperature': avetem.toFixed(2) }]
            //console.log("uv"+aveuv+"wind"+avewind+"humidity"+avehumidity+"tem"+avetem)


            var dbo = db.db("DataSensor");
            var adddata = { $push: { data: newdata.data[0] }, $set: { ave: newdata.ave } }

            await dbo.collection(findkey[0].key).update({ inBuilding: req.body['inBuilding'] }, adddata)
            console.log("1 document update");
            //db.close();


        }
        else {
            newdata['ave'] = [{ 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'] }]
            var dbo = db.db("DataSensor");

            await dbo.collection(findkey[0].key).insertOne(newdata)
            console.log("1 document insert");
            // db.close();


        }
        db.close();

    })
    res.end("OKKKKK")
}