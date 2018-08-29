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
        //
        var aveuv = null
        var avewind = null
        var avehumidity = null
        var avetem = null
        let newdata = {}
        newdata['inBuilding'] = req.body['inBuilding']
        newdata['rate'] = 5
        newdata['date'] = alltime.getTime()
        newdata['data'] = [{ 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': time }]

        var keylocation = 1
        var newlo = {}
        newlo['location'] = req.body['location']
        //datalo = { location: req.body['location'] }
        var haslo = true
        const find = await dbo.collection("location").find({ location: req.body['location']}).toArray()     //insert new location
        const findlengthlo = await dbo.collection("location").find({}).toArray() 
        //console.log("lo"+JSON.stringify(find[0].location))
        //console.log(data.location)
        //console.log(typeof(find.length))
        //console.log(find.hasOwnProperty(0))
        //console.log(find.length)
        if (find.hasOwnProperty(0) === true) {
            
            for (var i = 0; i < find.length; i++) {
                //console.log("infile" + find[0].location[i])
                if (find[0].location[i] === req.body['location']) {
                    haslo = false
                }
            }

            if (haslo) {
                console.log("update "+findlengthlo.length)
            keylocation=findlengthlo.length+1
                var insertlo = await dbo.collection("location").insertOne({ location: req.body['location'],key:keylocation.toString() }) 
                
            }
        }
        else {
            
            console.log("insert "+findlengthlo.length)
            keylocation=findlengthlo.length+1
            var insertlo = await dbo.collection("location").insertOne({ location: req.body['location'] ,key:keylocation.toString()}) 
        }
        const findkey = await dbo.collection("location").find({location: req.body['location']}).toArray() 
        console.log("kloc"+findkey[0].key)
        //
        var result = await dbo.collection(findkey[0].key).find({ inBuilding: req.body['inBuilding'], date: newdata['date'] }).toArray()
        /* if(result.length>0){
            console.log(result[0].date)
            console.log(checktime.getTime())
        } */

        if (result.length > 0 && result[0].date < checktime.getTime()) {
            console.log(result[0])
            console.log(result[0].data.length)
            console.log(result[0].ave[0].uv)
            console.log(newdata.data[0].uv)
            aveuv = ((result[0].data.length * result[0].ave[0].uv) + newdata.data[0].uv) / (result[0].data.length + 1)
            avewind = ((result[0].data.length * result[0].ave[0].wind) + newdata.data[0].wind) / (result[0].data.length + 1)
            avehumidity = ((result[0].data.length * result[0].ave[0].humidity) + newdata.data[0].humidity) / (result[0].data.length + 1)
            avetem = ((result[0].data.length * result[0].ave[0].temperature) + newdata.data[0].temperature) / (result[0].data.length + 1)
            newdata['ave'] = [{ 'uv': aveuv, 'wind': avewind, 'humidity': avehumidity, 'temperature': avetem }]
            //console.log("uv"+aveuv+"wind"+avewind+"humidity"+avehumidity+"tem"+avetem)


            var dbo = db.db("DataSensor");
            var adddata = { $push: { data: newdata.data[0] }, $set: { ave: newdata.ave } }
            var updatedata = await dbo.collection(findkey[0].key).update({ inBuilding: req.body['inBuilding'] }, adddata)
            console.log("1 document update");
            //db.close();


        }
        else {
            newdata['ave'] = [{ 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'] }]

            var dbo = db.db("DataSensor");
            var insertdata = await dbo.collection(findkey[0].key).insertOne(newdata)
            console.log("1 document insert");
            // db.close();


        }
        db.close();

    })
    res.end("OKKKKK")
}