
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
    /////////////check Session All///////////////////////
    dbo.collection(col_ses).find({session_id:req.sessionID},function (err, result) {
      if (result>0) {res.end(JSON.stringify(Bres))}
      else {
            req.checkBody('email').isEmpty
          req.checkBody('email').isEmail
          req.checkBody('PASS', 'Password is Empty do it again').isEmpty
          const errorValidate = req.validationErrors();
          if (errorValidate) {console.log(JSON.stringify(errorValidate))} 
          else {
            MongoClient.connect(url, function (err, db) {
              if (err) throw err;
              var dbo = db.db(DB);
              //////////////////have user/////////////////
              dbo.collection(col_user).find(myobj).toArray(function (err, result) {
                  if(result.length<=0) {res.end(JSON.stringify(Bres))}
                  else {
                    console.log("5555555555")
                    //////////compare password//////////////
                     myobj.PASS=req.body.PASS,myobj.isAdmin=result[0].isAdmin
                    console.log(myobj.isAdmin)
                    bcrypt.compare(myobj.PASS,result[0].PASS, function(err, respone) {
                      if(respone)    { 
                         MongoClient.connect(url, function (err, db) {
                                      if (err) throw err;
                                      Bres.name=result.name,Bres.isAdmin=result[0].isAdmin,Bres.comfirm=true  
                                      var dbo = db.db(DB);
                                      var hour = 10000
                                      req.session.cookie.expires = new Date(Date.now() + hour)
                          req.session.cookie.maxAge = hour           
                          req.session.user=result[0]
                                          /////////////add Session///////////////////////                                   
                                      dbo.collection(col_ses).insertOne({session_id:req.sessionID,session:req.session,isAdmin:result[0].isAdmin},function (err, result) {
                                        if (err) throw err;                                        
                                        res.end(JSON.stringify(Bres))
                                        console.log('welcom user')
                                      })
                                      db.close();

                              }) 
                      }
                      else {console.log('not same pass or user')
                            res.end(JSON.stringify(Bres))
                           }                              
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
}
          
  
        