exports.go=function(req,res){ 
    const MongoClient = require('mongodb').MongoClient
    const url = "mongodb://localhost:27017/"
    const col_ses="Sessions"
    const col_user="user"
    const DB="weather"
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        /////////////check Session admin///////////////////////
        dbo.collection(col_ses).find({seesion_id:req.sessionID,isAdmin:true},function (err, result) {
          if (result>0) {console.log('have user login')}
          ///////////show user//////////
          else{MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db(DB);
                dbo.collection(col_user).find({status:true}).toArray(function (err, result) {
                req.session
                if (err) throw err;
                console.log("GET")
                console.log(result);
                res.end(JSON.stringify(result))
                db.close();
                });

                })
            }
    
    
        })
    })
}