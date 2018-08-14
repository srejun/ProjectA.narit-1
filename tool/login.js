
exports.go = function (req, res) {
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb').MongoClient
  const url = "mongodb://localhost:27017/"
  const col_ses="Sessions"
  const col_user="user"
  const DB="weather"
  var Bres ={name:null,comfirm:false,isAdmin:null,}
  var myobj={email:req.body.email,status:true}
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DB);
    console.log(req.body)
    /////////////check Session All(id&email)///////////////////////
    dbo.collection(col_ses).find({session_id:String(req.sessionID),email:myobj.email}).toArray(function (err, result) {
      
      if (result.length>0) {console.log("have session"+JSON.stringify(result[0].session_id))}
      else {
        /////////////////check form input///////////////////
        req.checkBody('email').isEmpty
        req.checkBody('email').isEmail
        req.checkBody('PASS', 'Password is Empty doit again').isEmpty
        const errorValidate = req.validationErrors();
        if (errorValidate) {console.log(JSON.stringify(errorValidate))} 
        else {
            MongoClient.connect(url, function (err, db) {
              if (err) throw err;
              var dbo = db.db(DB);
              //////////////////have user/////////////////
              dbo.collection(col_user).find(myobj).toArray(function (err, result) {
                  if(result.length<=0) {console.log("NO user pls regis")}
                  else {
                    //////////compare password//////////////
                     myobj.PASS=req.body.PASS,myobj.isAdmin=result[0].isAdmin
                    bcrypt.compare(myobj.PASS,result[0].PASS, function(err, respone) {
                      if(respone)    { 
                         MongoClient.connect(url, function (err, db) {
                                      if (err) throw err;
                                      Bres.name=result[0].name,Bres.isAdmin=result[0].isAdmin,Bres.comfirm=true  
                                      var dbo = db.db(DB);
                                      var hour = 3*60*60*1000
                                      req.session.cookie.expires = new Date(Date.now() + hour)
                          req.session.cookie.maxAge = hour           
                                          /////////////add Session///////////////////////                                   
                                      dbo.collection(col_ses).insertOne({"session_id":req.sessionID,isAdmin:result[0].isAdmin,name:result[0].name,email:result[0].email},function (err, result) {
                                        if (err) throw err;                                        
                                        console.log('welcom user'+JSON.stringify(Bres)+req.sessionID)
                                      })
                                      db.close();

                              }) 
                      }
                      else {console.log('not same pass or user')}                              
                    })                   
                  }
              })        
              db.close();
            })
          }
       }           
      
    })
  db.close();
  })
  res.end(JSON.stringify(Bres))
}
          
  
        