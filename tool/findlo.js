var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    MongoClient.connect(url,async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var location = {}
        var findlo = await dbo.collection("location").find({},{projection:{ _id: 0}}).toArray()
        //console.log(findlo.datalo)
        console.log(findlo.length)
        for(var i=0;i<findlo.length;i++){
            //console.log(findlo[i].datalo.location)
            location[i]=findlo[i].datalo.location
        }
        console.log(location)
        res.end(JSON.stringify(location))
    })
    //
    //res.end("OKKKKK")
}