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
        var time = date.getTime()
        myobj['data'].time = time
        // var year = date.getFullYear()
        // var month = date.getMonth()
        // var day = date.getDate()
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
        if (req.body['data']['uv'] === undefined) { req.body['data']['uv'] = 0 }
        if (req.body['data']['wind'] === undefined) { req.body['data']['wind'] = 0 }
        if (req.body['data']['humidity'] === undefined) { req.body['data']['humidity'] = 0 }
        if (req.body['data']['temperature'] === undefined) { req.body['data']['temperature'] = 0 }
        let timenow
        let datenow
        let newdata = {}
        newdata['location'] = req.body['location']
        newdata['inBuilding'] = req.body['inBuilding']
        newdata['rate'] = 5
        newdata['date'] = alltime.getTime()
        var adddata
        var find = "nodata"
        dbo.collection("from").find({ location: req.body['location'], inBuilding: req.body['inBuilding']}).toArray(function (err, result) {
            if (err) throw err;
            find = result.length
            //console.log(result.length)
            console.log("res" + result.length)
            timenow = result[result.length - 1].data[result[result.length - 1].data.length - 1].time
            datenow = result[result.length - 1].date
            console.log("time" + datenow)

            if (result.length > 0) {
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("DataSensor");
                    for (i = 0; i < 4000; i++) {
                        timenow = timenow + (30000)
                        
                        req.body['data']['uv']=req.body['data']['uv']+1
                        req.body['data']['wind']=req.body['data']['wind']+1
                        req.body['data']['humidity']=req.body['data']['humidity']+1
                        req.body['data']['temperature']=req.body['data']['temperature']+1
                        newdata['data'] = [{ 'uv': req.body['data']['uv'], 'wind': req.body['data']['wind'], 'humidity': req.body['data']['humidity'], 'temperature': req.body['data']['temperature'], 'time': timenow }]
                        //console.log(newdata)
                        // newdata['data']['time']=timenow
                        //console.log(newdata)
                        //console.log(result[0].date)
                        //console.log("c"+checktime.getTime()+typeof(checktime.getTime()))
                        //console.log("t"+timenow+typeof(timenow))  
                        adddata = { $push: { data: newdata.data[0] } }
                        if (timenow < checktime.getTime()) {

                            dbo.collection("from").update({ location: req.body['location'], inBuilding: req.body['inBuilding'],date: datenow }, adddata, function (err, res) {
                                if (err) throw err;
                                console.log("1 document update");
                                db.close();
                            });


                        }

                    }
                })
            }

        });
        // s

        //console.log(timenow)
        db.close();

    })
    res.end("OKKKKK")
}