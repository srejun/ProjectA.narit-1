var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
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

        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()

        var alltime = new Date(req.body['date']+" " + "00:00:00 ")
        var year = alltime.getFullYear()
        var month = alltime.getMonth()
        var day = alltime.getDate()
        var sum = year + "/" + (month + 1) + "/" + (day + 1)
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

         var aveuv = null
        var avewind = null
        var avehumidity = null
        var avetem = null
        let newdata = {}
        newdata['inBuilding'] = req.body['inBuilding']
        newdata['rate'] = 5
        newdata['date'] = alltime.getTime()
        newdata['data'] = [{ uv: req.body['data']['uv'], wind: req.body['data']['wind'], humidity: req.body['data']['humidity'], temperature: req.body['data']['temperature'], time: time }]

        var haslo = true
        const find = await dbo.collection("location").find({ location: req.body['location'] }).toArray()     //insert new location

        if (find.hasOwnProperty(0) === true) {
            for (var i = 0; i < find.length; i++) {
                console.log("infile" + find[0].location[i])
                if (find[0].location[i] === req.body['location']) {
                    haslo = false
                }
            }

            if (haslo) {
                await dbo.collection("location").insertOne({ location: req.body['location'] }, function (err, res) {
                    if (err) throw err;
                    console.log("1 document update");
                    db.close();
                });
            }
        }
        else {
            await dbo.collection("location").insertOne({ location: req.body['location'] }, function (err, res) {
                if (err) throw err;
                console.log("1 document insert");
                db.close();
            });
        }


        var result = await dbo.collection(req.body['location']).find({ inBuilding: req.body['inBuilding'], date: newdata['date'] }).toArray()
        if (err) throw err;

        if (result.length > 0 && result[0].date < checktime.getTime()) {
            aveuv = ((result[0].data.length * result[0].ave[0].uv) + newdata.data[0].uv) / (result[0].data.length + 1)
            avewind = ((result[0].data.length * result[0].ave[0].wind) + newdata.data[0].wind) / (result[0].data.length + 1)
            avehumidity = ((result[0].data.length * result[0].ave[0].humidity) + newdata.data[0].humidity) / (result[0].data.length + 1)
            avetem = ((result[0].data.length * result[0].ave[0].temperature) + newdata.data[0].temperature) / (result[0].data.length + 1)
            newdata['ave'] = [{ 'uv': aveuv, 'wind': avewind, 'humidity': avehumidity, 'temperature': avetem }]
            MongoClient.connect(url,async function (err, db) {
                if (err) throw err;
                var dbo = db.db("DataSensor");
                var adddata = { $push: { data: newdata.data[0] }, $set: { ave: newdata.ave } }
                await dbo.collection(req.body['location']).update({ inBuilding: req.body['inBuilding'] }, adddata, function (err, res) {
                    if (err) throw err;
                    console.log("1 document update");
                    db.close();
                });
            })
        }
        else {
            newdata['ave'] = [{ 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'] }]
            MongoClient.connect(url,async function (err, db) {
                if (err) throw err;
                var dbo = db.db("DataSensor");
                await dbo.collection(req.body['location']).insertOne(newdata, function (err, res) {
                    if (err) throw err;
                    console.log("1 document insert");
                    db.close();
                });
            })
        }
        db.close(); 

    })
    res.end("OKKKKK")
}