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
        var time = date.getTime()
        myobj['data'].time = time

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
        let timenow
        let datenow
        var indexlo = 0
        let newdata = {}
        let changdata = {}
        let currentdata = {}
        
        newdata['inBuilding'] = req.body['inBuilding']
        newdata['rate'] = 5
        newdata['date'] = alltime.getTime()
        var adddata
        //var find = "nodata"
        const find = await dbo.collection("location").find({ location: req.body['location'] }).toArray()
        var result = await dbo.collection(find[0].key).find({ inBuilding: req.body['inBuilding'] }).toArray()

        //find = result.length
        //console.log(result.length)
        //console.log("res" + result.length)
        timenow = result[result.length - 1].data[result[result.length - 1].data.length - 1].time
        datenow = result[result.length - 1].date
        console.log("time " + datenow)

        if (result.length > 0) {

            var dbo = db.db("DataSensor");
            for (i = 0; i < 4000; i++) {
                timenow = timenow + (300000)
                changdata['data'] = { 'uv': req.body['data']['uv'] + Math.floor(Math.random() * 45) + 1, 'wind': req.body['data']['wind']+ Math.floor(Math.random() * 45) + 1, 'humidity': req.body['data']['humidity']+ Math.floor(Math.random() * 45) + 1, 'temperature': req.body['data']['temperature']+ Math.floor(Math.random() * 45) + 1}
                //console.log(changdata['data'])
                if (req.body['inBuilding']) {
                    if (req.body['data']['humidity'] > 75) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time, 'flag': 'dark' }]
                    else if (req.body['data']['humidity'] > 70) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time, 'flag': 'danger' }]
                    else if (req.body['data']['humidity'] > 65) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time, 'flag': 'warning' }]
                    else if (req.body['data']['humidity'] > 60) currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time, 'flag': 'success' }]
                    else currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time, 'flag': 'light' }]
                }
                else{
                    currentdata['data'] = [{ inBuilding: req.body['inBuilding'], 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time}]
                }

                newdata['data'] = [{ 'uv': changdata['data']['uv'], 'wind': changdata['data']['wind'], 'humidity': changdata['data']['humidity'], 'temperature': changdata['data']['temperature'], 'time': timenow }]
                aveuv = ((result[0].data.length * result[0].ave[0].uv) + newdata.data[0].uv) / (result[0].data.length + 1)
                avewind = ((result[0].data.length * result[0].ave[0].wind) + newdata.data[0].wind) / (result[0].data.length + 1)
                avehumidity = ((result[0].data.length * result[0].ave[0].humidity) + newdata.data[0].humidity) / (result[0].data.length + 1)
                avetem = ((result[0].data.length * result[0].ave[0].temperature) + newdata.data[0].temperature) / (result[0].data.length + 1)
                newdata['ave'] = [{ 'uv': aveuv.toFixed(2), 'wind': avewind.toFixed(2), 'humidity': avehumidity.toFixed(2), 'temperature': avetem.toFixed(2) }]
                adddata = { $push: { data: newdata.data[0] }, $set: { ave: newdata.ave } }

                if (timenow < checktime.getTime()) {
                    if (req.body['inBuilding'] === true) {
                        var updatecurrentdata = { $set: { indoor: currentdata.data[0] } }

                        var updatesertloaddin = await dbo.collection("location").updateOne({ location: find[indexlo].location }, updatecurrentdata)
                    }
                    else {
                        var updatecurrentdata = { $set: { outdoor: currentdata.data[0] } }
                        var updatesertloaddout = await dbo.collection("location").updateOne({ location: find[indexlo].location }, updatecurrentdata)
                    }
                    await dbo.collection(find[0].key).update({ inBuilding: req.body['inBuilding'], date: datenow }, adddata)
                }

            }


        }
        // s

        //console.log(timenow)
        db.close();

    })
    res.end("OKKKKK")
}