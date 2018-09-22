var MongoClient = require('mongodb').MongoClient
var url = require("../config").url
exports.go = function (req, res) {
    var value = { confirm: false, err: '', data: null }

    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined || req.body['Fyear'] === undefined|| req.body['Tyear'] === undefined) {
        value.err = 'no filter'
        res.end(JSON.stringify(value))
    }
    else {
        MongoClient.connect(url, async function (err, db) {
            var dbo = db.db("DataSensor");
            var have_ses = await dbo.collection("Sessions").find({ session_id: req.sessionID }).toArray()
            if (have_ses.length <= 0) {
                value.err = 'permission denied'
                console.log(value)
                res.end(JSON.stringify(value))
            }
            else {



                const findkey = await dbo.collection("location").find({ location: req.body['location'], status: true }).toArray()

                async function getYdata(x) {
                   return result = await dbo.collection(findkey[0].key).find({ inBuilding: req.body['inBuilding'], date: { $gte: new Date(x + "-01-01 00:00:00").getTime(), $lt: new Date((parseInt(x) + 1).toString() + "-01-01 00:00:00").getTime() } }).toArray()
                } 
                var data =[];
                for(var i =req.body['Fyear'].parseInt();i<=req.body['Tyear'].parseInt();i++)
                {
                    data.push(getYdata(i))
                }
                //res.end(JSON.stringify(data))
                res.end("OK")
           
               


            }
            db.close()
        });
    }
}
