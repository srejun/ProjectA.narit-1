var MongoClient = require('mongodb').MongoClient
var url = require("..config").url
exports.go = function (req, res) {

    if (req.body['location'] === undefined || req.body['inBuilding'] === undefined ) {
        res.end("ERROR")
        throw ("ERROR")
    }
 
         MongoClient.connect(url, async function (err, db) {
  console.log(new Date("2018"+":"+req.body['month']).toDateString())

  console.log( new Date("2018/"+ ( parseInt(req.body['month'])+1).toString()).toDateString())

  var dbo = db.db("DataSensor");
    var result = await dbo.collection(req.body['location']).find({
        inBuilding:req.body['inBuilding'] ,date:{ $gte:new Date("2018/"+req.body['month']+"/1 00:00:00").getTime(),$lt:new Date("2018/"+ ( parseInt(req.body['month'])+1).toString()+"/1 00:00:00").getTime()}
    }).toArray()
    console.log(result.length)
    var form = {
        humid: [],
        uv: [],
        tmp: [],
        wind: [],
        time: []
    }
   for(var i = 0; i<result.length;i++)
   {
    console.log(new Date(result[i].date).toDateString()+" "+result[i].ave[0].uv)
    form.humid.push(result[i].ave[0].humidity)
    form.time.push(new Date(result[i].date).toLocaleDateString())
    form.uv.push(result[i].ave[0].uv)
    form.wind.push(result[i].ave[0].wind)
    form.tmp.push(result[i].ave[0].temperature)
   }  
    res.end(JSON.stringify(form));
});
}

//,$gte:new Date("2018"+":"+req.body['month']+":1 00:00:00").getTime()  $gte:new Date("2018"+":"+parseInt(req.body['month'])+":1 00:00:00").getTime(),