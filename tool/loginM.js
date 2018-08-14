
exports.go =  function (req, res) {
 
    const bcrypt = require('bcrypt');
    const MongoClient = require('mongodb').MongoClient
    const url = "mongodb://localhost:27017/"
  
    const col_ses="Sessions"
    const col_user="user"
    const DB="weather"
    var Bres ={name:null,comfirm:false,isAdmin:null,}
    var myobj={email:req.body.email,status:true}
    var hav_ses=null
    var have_use=null
    var math=null 
    var login=null
    var hour = 3*60*60*1000
    req.session.cookie.expires = new Date(Date.now() + hour)
    req.session.cookie.maxAge = hour 
    req.checkBody('email').isEmpty
        req.checkBody('email').isEmail
        req.checkBody('PASS', 'Password is Empty doit again').isEmpty
        const errorValidate = req.validationErrors();
        if (errorValidate) {console.log(JSON.stringify(errorValidate)),  res.end(JSON.stringify(Bres))
        } 
     MongoClient.connect(url,async function (err, db) {
      if (err) throw err;
      var dbo = db.db(DB);
      /////////////check Session All(id&email)///////////////////////
       hav_ses= await dbo.collection(col_ses).find({session_id:String(req.sessionID),email:myobj.email}).toArray() 
       have_use= await dbo.collection(col_user).find(myobj).toArray()  
       myobj.PASS=req.body.PASS
       if(have_use.length>0){myobj.isAdmin=have_use[0].isAdmin
            math=await bcrypt.compare(myobj.PASS,have_use[0].PASS)    }
       if(math&&have_use.length>0){login=true}
       if(login&&hav_ses.length<=0)
            { Bres.name=have_use[0].name,Bres.isAdmin=have_use[0].isAdmin,Bres.comfirm=true 
              dbo.collection(col_ses).insertOne({"session_id":req.sessionID,isAdmin:have_use[0].isAdmin,name:have_use[0].name,email:have_use[0].email},function (err, result) 
                    {console.log('welcom user'+JSON.stringify(Bres)+req.sessionID)}                                      
            )}            
        else if(hav_ses.length>0&&login) {console.log('have session of '+have_use[0].name)+"login now"}
        else if (!login) {console.log("not same pass or user"+JSON.stringify(req.body.email+req.body.PASS))}
        console.log("Bres="+JSON.stringify(Bres)) , res.end(JSON.stringify(Bres)) ,db.close() 
                                }) 
    
              
     
                               
  }
            
    
          