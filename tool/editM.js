
exports.go =  function (req, res) {
 
    const bcrypt = require('bcrypt');
    const MongoClient = require('mongodb').MongoClient
    const url = "mongodb://localhost:27017/"
    const saltRounds=10
    const col_ses="Sessions"
    const col_user="user"
    const DB="weather"
    var Bres ={status:null,err:null}
    var myobj={email:req.body.email,status:true,name:req.body.name}
    var have_ses=null
    var have_use=null
    var newvalues = {$set: { PASS: req.body.NewPass}}
    var hour = 3*60*60*1000
    req.session.cookie.expires = new Date(Date.now() + hour)
    req.session.cookie.maxAge = hour 
    req.checkBody('email').isEmpty
        req.checkBody('email').isEmail
        req.checkBody('name').isEmpty
        const errorValidate = req.validationErrors();
        if (errorValidate) {console.log(JSON.stringify(errorValidate)),  res.end(JSON.stringify(Bres))
        } 
     MongoClient.connect(url,async function (err, db) {
      if (err) throw err;
      var dbo = db.db(DB);
       have_ses= await dbo.collection(col_ses).find({session_id:req.sessionID,isAdmin:true}).toArray()
       have_use= await dbo.collection(col_user).find(myobj).toArray()

       if(have_ses.length<=0){console.log('permission denied'),Bres.err="not Admin", Bres.status=false, Bres.err='notAdmin'}
       else if(have_ses.length>0&&have_use.length<=0){console.log('NO user in DB'),Bres.err="no User", Bres.status=false, Bres.err='Nouser'}
       else if(have_ses.length>0&&have_use.length>0){
          var hash = bcrypt.hashSync(req.body.NewPass, saltRounds);
            newvalues.$set.PASS=hash 
            dbo.collection(col_user).updateOne(myobj, newvalues, function (err, result) {
                if (err) throw err;
            res.end(JSON.stringify(myobj))  

            });
        Bres.status=true}
        console.log("Bres="+JSON.stringify(Bres)+JSON.stringify(req.session.cookie.expires)+JSON.stringify(req.sessionID)) , res.end(JSON.stringify(Bres)) ,db.close() 
                                }) 
    
              
     
                               
  }
            
    
          