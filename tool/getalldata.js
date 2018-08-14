var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    var date = new Date()
    var mysort = { location: 1 };

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        dbo.collection("from").find({}).sort(mysort).toArray(function (err, result) {
            if (err) throw err;
            /* console.log(result);
            console.log(result.length)
            console.log(result[0].data.length)
            console.log(result[1].data.length) */
            let max = {}
            //console.log(JSON.stringify(result[0].data[0]))
            for (var i = 0; i < result.length; i++) {
                max[i] = { 'location': result[i].location, 'inBuilding': result[i].inBuilding, 'data': result[i].data[0] }
                /* if(result[i].data[0].time.getTime()>max[i].data.time.getTime()){
                  console.log(max[i].data.time.getTime())
                  console.log(result[i].data[0].time.getTime())
                } */

                for (var j = 0; j < result[i].data.length; j++) {
                    if (result[i].data[j].time > max[i].data.time) {
                        max[i].data = result[i].data[j]
                    }
                }
            }
            console.log(max)
            res.end(JSON.stringify(max))
            db.close();
        });
    });
}