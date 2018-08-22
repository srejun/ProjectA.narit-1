exports.go=function(req,res){ 
    const MongoClient = require('mongodb').MongoClient
    const url = "mongodb://localhost:27017/"
    const col_ses="Sessions"
    const col_user="user"
    const DB="weather"
    var Bres ={confirm: false,err:null,data=null}
    var have_ses=null
    MongoClient.connect(url,async function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
       have_ses=await dbo.collection(col_ses).find({seesion_id:req.sessionID,isAdmin:true})
          if (have_ses.length>0) {console.log('have user login'),Bres.err="same session"}
          else{
                dbo.collection(col_user).find({status:true}).toArray(function (err, result) {
                if (err) throw err;
                console.log("GET")
                console.log(result);
                Bres.data=result
                res.end(Bres)
                db.close();
                });

                
            }
    
    
        })

}