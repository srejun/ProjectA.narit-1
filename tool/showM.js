exports.go=function(req,res){ 
    const MongoClient = require('mongodb').MongoClient
    const url = "mongodb://localhost:27017/"
    const col_ses="Sessions"
    const col_user="user"
    const DB="weather"
    var Bres ={confirm: false,err:null,data:null}
    var have_ses=null
    MongoClient.connect(url,async function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        have_ses= await dbo.collection(col_ses).find({session_id:req.sessionID,isAdmin:true}).toArray() 
          if (have_ses.length<=0) {console.log('permission denied'),Bres.err="not admin"}
          else{
                var user= await dbo.collection(col_user).find({status:true}).project({_id : 0, name:1 , isAdmin:1, email:1}).toArray()
                if(user.length<=0){Bres.err='No data'}
                else{Bres.confirm=true,Bres.data=user}           
                }

                console.log(JSON.stringify(have_ses[0]))
                res.end(JSON.stringify(Bres))
            
    
      db.close();
        })

}