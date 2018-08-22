var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    MongoClient.connect(url,async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var findlo = await dbo.collection("location").find({},{projection:{ _id: 0}}).toArray()
        console.log(findlo)
        res.end(JSON.stringify(findlo))
    })
    
    //res.end("OKKKKK")
}