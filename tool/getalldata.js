var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"
exports.go = function (req, res) {
    var date = new Date()
    var mysort = { date: 1 };
    var max = {}
    var value = {}
    var maxin = {}
    var maxout = {}
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("DataSensor");
        var have_ses= await dbo.collection(col_ses).find({session_id:String(req.sessionID)}).toArray() 
        var findalllocation = await dbo.collection("location").find({}).sort(mysort).toArray()
        console.log(findalllocation.length)
        for (var l = 0; l < findalllocation.length; l++) {
            console.log(findalllocation[l].datalo.location)
            var eachlocationin = await dbo.collection(findalllocation[l].datalo.location).find({ inBuilding: true }).sort(mysort).toArray()
            var eachlocationout = await dbo.collection(findalllocation[l].datalo.location).find({ inBuilding: false }).sort(mysort).toArray()
            console.log(eachlocationin.length)
            console.log(eachlocationout.length)
            //
            //await console.log(eachlocationin[eachlocationin.length-1].data.length)
            //await console.log(eachlocationin[eachlocationin.length-1].data[eachlocationin[eachlocationin.length-1].data.length-1])
            //await console.log(eachlocationout[eachlocationout.length-1].data.length)
            //await console.log(eachlocationout[eachlocationout.length-1].data[eachlocationout[eachlocationout.length-1].data.length-1])
            if (eachlocationin.length > 0) {
                if(eachlocationin[eachlocationin.length - 1].data[eachlocationin[eachlocationin.length - 1].data.length - 1].humidity>40){
                    maxin[l] = { 'inBuilding': true, 'data': eachlocationin[eachlocationin.length - 1].data[eachlocationin[eachlocationin.length - 1].data.length - 1],'flag':0 }
                }
                else if(eachlocationin[eachlocationin.length - 1].data[eachlocationin[eachlocationin.length - 1].data.length - 1].humidity>50){
                    maxin[l] = { 'inBuilding': true, 'data': eachlocationin[eachlocationin.length - 1].data[eachlocationin[eachlocationin.length - 1].data.length - 1],'flag':1 }
                }
                else{
                    maxin[l] = { 'inBuilding': true, 'data': eachlocationin[eachlocationin.length - 1].data[eachlocationin[eachlocationin.length - 1].data.length - 1],'flag':2 }
                }
                
            }
            else {
                maxin[l] = { 'inBuilding': true, 'data': null }
            }
            if (eachlocationout.length > 0) {
                if(eachlocationout[eachlocationout.length - 1].data[eachlocationout[eachlocationout.length - 1].data.length - 1].humidity>40){
                    maxout[l] = { 'inBuilding': false, 'data': eachlocationout[eachlocationout.length - 1].data[eachlocationout[eachlocationout.length - 1].data.length - 1],'flag':0 }
                }
                else if(eachlocationout[eachlocationout.length - 1].data[eachlocationout[eachlocationout.length - 1].data.length - 1].humidity>50){
                    maxout[l] = { 'inBuilding': false, 'data': eachlocationout[eachlocationout.length - 1].data[eachlocationout[eachlocationout.length - 1].data.length - 1],'flag':1 }
                }
                else{
                    maxout[l] = { 'inBuilding': false, 'data': eachlocationout[eachlocationout.length - 1].data[eachlocationout[eachlocationout.length - 1].data.length - 1],'flag':2 }
                }
            }
            else {
                maxout[l] = { 'inBuilding': false, 'data': null }
            }
            max[l] = { 'location': findalllocation[l].datalo.location,'indoor':maxin[l],'outdoor':maxout[l] }


            // for (var j = 0; j < eachlocation[l].length; j++) {
            //     if (eachlocationin[i].data[j].time > maxin[i].data.time) {
            //         maxin[i].data = result[i].data[j]
            //     }
            // }

        }
        //console.log(JSON.stringify(max))
        //console.log("innnnn" + JSON.stringify(maxin))
        //console.log("outttt" + JSON.stringify(maxout))
        /* console.log(result);
        console.log(result.length)
        console.log(result[0].data.length)
        console.log(result[1].data.length) */

        //console.log(JSON.stringify(result[0].data[0]))


        // for (var i = 0; i < result.length; i++) {
        //     max[i] = { 'location': result[i].location, 'inBuilding': result[i].inBuilding, 'data': result[i].data[0] }
        //     /* if(result[i].data[0].time.getTime()>max[i].data.time.getTime()){
        //       console.log(max[i].data.time.getTime())
        //       console.log(result[i].data[0].time.getTime())
        //     } */

        //     for (var j = 0; j < result[i].data.length; j++) {
        //         if (result[i].data[j].time > max[i].data.time) {
        //             max[i].data = result[i].data[j]
        //         }
        //     }
        // }
        // console.log(max)
        if(have_ses.length>0){
            value={confirm:true,data:max}
            res.end(JSON.stringify(value))
        }
        else{
            value={confirm:false,data:null}
            res.end(JSON.stringify(value))
        }
        //value={confirm:true,data:max}
        //res.end(JSON.stringify(value))
        db.close();

    });
}