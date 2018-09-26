var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor")
        var value = {
            confirm: false,
            err: '',
        }
        console.log(req.body)

        if (req.body.location === undefined
            || req.body.timestamp === undefined
            || req.body.flag === undefined
            || req.body.time === undefined
            || req.body.temperature === undefined
            || req.body.humidity === undefined
            || req.body.uv === undefined
            || req.body.wind === undefined
            || req.body.detail === undefined) {
            value.err = 'input failed'
            console.log('input failed')
        }
        else {
            var new_data = {}
            var date = new Date(new Date(req.body.timestamp).toDateString()).getTime()
            var find = await dbo.collection("Train").find({ location: req.body.location, date: date }).toArray()
            console.log(date)
            new_data.timestamp = req.body.timestamp
            new_data.flag = req.body.flag
            new_data.time = req.body.time
            new_data.temperature = req.body.temperature
            new_data.humidity = req.body.humidity
            new_data.uv = req.body.uv
            new_data.wind = req.body.wind
            new_data.detail = req.body.detail

            if (find.length > 0) {
                //update data
                var filter = { location: req.body.location, date: date }
                var update = { $push: { datas: new_data } }
                await dbo.collection("Train").updateOne(filter, update)
                console.log('update')
            }
            else {
                //new data
                var insert = { location: req.body.location, date: date, datas: [new_data] }
                await dbo.collection("Train").insertOne(insert)
                console.log('insert')
            }

            value.confirm = true
        }

        res.end("ok")
        db.close()
    })
}