
exports.go =  function (req, res) {
 
    const MongoClient = require('mongodb').MongoClient
    const url = "mongodb://localhost:27017/"
    const col_ses="Sessions"
    const col_user="user"
    const DB="weather"
    var Bres ={status:false,err:null}
    var myobj={email:req.body.email,status:true,name:req.body.name}
    var newvalues = {$set: { status: false}}
    var have_ses=null
    var have_use=null
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
       if(have_ses.length>0){if(have_ses[0].email==myobj.email){Bres.status=false,Bres.err='del your self'}else{         
         console.log('delete user form col_ses,col_use'),Bres.status=true
         await dbo.collection(col_ses).deleteOne(myobj)
         await dbo.collection(col_user).updateOne(myobj, newvalues)
       }}
       else if(have_ses.length<=0){Bres.status=false,Bres.err="permission denied",console.log('not admin')}
       else if(have_use.length<=0){Bres.status=false,Bres.err='No user',console.log('No user in DB')}
       //else if(have_ses.length>0&&have_use.length>0)
      
       
        console.log("Bres="+JSON.stringify(Bres)+JSON.stringify(req.session.cookie.expires)+JSON.stringify(req.sessionID)) , res.end(JSON.stringify(Bres)) ,db.close() 
                                }) 
    
              
     
                               
  }
            
    
          