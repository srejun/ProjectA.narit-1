var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['data'] === undefined) {
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
        var year = date.getFullYear()
        var month = date.getMonth()
        var day = date.getDate()
        var checktime = new Date(year + "/" + (month + 1) + "/" + (day + 1))
        var alltime = new Date(year + "/" + (month + 1) + "/" + day)
        //console.log(alltime)
        // console.log(checktime)
        //console.log(req.body['data']['uv'])

        if (req.body['data']['uv'] === undefined) { req.body['data']['uv'] = 0 }
        //console.log(req.body['data']['uv'])
        if (req.body['data']['wind'] === undefined) { req.body['data']['wind'] = 0 }
        //console.log(req.body['data']['wind'])
        if (req.body['data']['humidity'] === undefined) { req.body['data']['humidity'] = 0 }
        //console.log(req.body['data']['humidity'])
        if (req.body['data']['temperature'] === undefined) { req.body['data']['temperature'] = 0 }
        //console.log(req.body['data']['temperature'])
        //console.log(req.body)
        var indexdata = {}
        var testvalue
        var timenow
        var datenow
        dbo.collection("from").find({ location: req.body['location'], inBuilding: req.body['inBuilding'] }).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result)
            /* if(result.length>0){
                console.log(result[0].date)
                console.log(checktime.getTime())
            } */
            //console.log(result.length)
            if (result.length > 0) {
                datenow = result[result.length - 1].date
                indexdata = result
            }
            db.close();
            //console.log
            //console.log(indexdata[0].data[0].time)
        });
        setTimeout(() => {
            
            console.log("date" + datenow)
        }, 100);

        for (var i = 0; i < 100; i++) {
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("DataSensor");
                dbo.collection("from").find({ location: req.body['location'], inBuilding: req.body['inBuilding'], date: datenow }).toArray(function (err, result) {
                    if (err) throw err;
                    /* if(result.length>0){
                        console.log(result[0].date)
                        console.log(checktime.getTime())
                    } */
                    if (result.length > 0) {
                        testvalue = result.length
                        //console.log("CAN FIND")
                        //console.log(testvalue)
                    }
                    
                    db.close();
                });
                // setTimeout(() => {
                //     //console.log(result)
                //     //console.log("test" + indexdata.length)
                // }, 100000);

                console.log(indexdata)
                indexdata[0]['data']['uv'] = indexdata[0]['data']['uv'] + 1
                indexdata[0]['data']['wind'] = indexdata[0]['data']['wind'] + 1
                indexdata[0]['data']['humidity'] = indexdata[0]['data']['humidity'] + 1
                indexdata[0]['data']['temperature'] = indexdata[0]['data']['temperature'] + 1
                timenow = indexdata[0]['time']
                timenow += 60000
                let newdata = {}
                newdata['location'] = indexdata[0]['location']
                newdata['inBuilding'] = indexdata[0]['inBuilding']
                newdata['rate'] = 5
                newdata['date'] = alltime.getTime()
                newdata['data'] = [{ 'uv': indexdata[0]['data']['uv'], 'wind': indexdata[0]['data']['wind'], 'humidity': indexdata[0]['data']['humidity'], 'temperature': indexdata[0]['data']['temperature'], 'time': timenow }]
                //console.log(newdata)
                if (testvalue > 0) {

                    adddata = { $push: { data: newdata.data[0] } }
                    dbo.collection("from").update({ location: indexdata[0]['location'], inBuilding: indexdata[0]['inBuilding'] }, adddata, function (err, res) {
                        if (err) throw err;
                        //console.log("1 document update");
                        db.close();
                    });

                }
                else {

                    dbo.collection("from").insertOne(newdata, function (err, res) {
                        if (err) throw err;
                        //console.log("1 document insert");
                        db.close();
                    });
                    datenow+=86400

                }
            })

        }

        // if (result.length > 0 && result[0].date < checktime.getTime()) {

        //     MongoClient.connect(url, function (err, db) {
        //         if (err) throw err;
        //         var dbo = db.db("DataSensor");
        //         var adddata = { $push: { data: newdata.data[0] } }
        //         dbo.collection("from").update({ location: req.body['location'], inBuilding: req.body['inBuilding'] }, adddata, function (err, res) {
        //             if (err) throw err;
        //             console.log("1 document update");
        //             db.close();
        //         });
        //     })
        // }
        // else {
        //     MongoClient.connect(url, function (err, db) {
        //         if (err) throw err;
        //         var dbo = db.db("DataSensor");
        //         dbo.collection("from").insertOne(newdata, function (err, res) {
        //             if (err) throw err;
        //             console.log("1 document insert");
        //             db.close();
        //         });
        //     })
        // }

    })
    res.end("OKKKKK")
}