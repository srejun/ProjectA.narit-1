var MongoClient = require('mongodb').MongoClient
var url = require("../config").url 
exports.go = function (req, res) {
    var date = new Date()
    var mysort = { location: 1 };
    var data = {}
    var newlo = {}
    var haslo = true
    data = {location:req.body['location']}
    //console.log(data)
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        const find = await dbo.collection("location").find().toArray()
        //console.log("lo"+JSON.stringify(find[0].location))
        //console.log(data.location)
        //console.log(typeof(find.length))
        //console.log(find.hasOwnProperty(0))
        //console.log(find.length)
        if (find.hasOwnProperty(0)) {
            for (var i = 0; i < find.length; i++) {
                console.log("infile"+find[0].data.location[i])
                if (find[0].data.location[i] === data.location) {  
                    haslo = false
                }
            }
            
            if (haslo) {
                dbo.collection("location").insertOne({data}, function (err, res) {
                    if (err) throw err;
                    console.log("1 document update");
                    db.close();
                });
            }
        }
        else {
            dbo.collection("location").insertOne({data}, function (err, res) {
                if (err) throw err;
                console.log("1 document insert");
                db.close();
            });
        }
        db.close();
    });
    res.end("response")
}