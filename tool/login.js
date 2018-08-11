
exports.go = function (req, res) {
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb').MongoClient
  const url = "mongodb://localhost:27017/"
  const col_ses="Sessions"
  const col_user="user"
  const DB="weather"
  var myobj={name:req.body.name,email:req.body.email,status:true,isAdmin:req.body.isAdmin}
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DB);
    /////////////check Session All///////////////////////
    dbo.collection(col_ses).find({seesion_id:req.sessionID,isAdmin:myobj.isAdmin},function (err, result) {
      if (result>0) {console.log('have user login')}
      else {
          req.checkBody('name', 'name Must have not Empty').isEmpty
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
                  if(result.length<=0) {console.log('NO user'),res.end('NO user')}
                  else {
                    //////////compare password//////////////
                    console.log(typeof(req.body.PASS))
                    myobj.PASS=req.body.PASS
                    bcrypt.compare(myobj.PASS,result[0].PASS, function(err, respone) {
                      if(respone)    {                    
                            MongoClient.connect(url, function (err, db) {
                                      if (err) throw err;
                                          /////////////add Session///////////////////////
                                      var dbo = db.db(DB);
                                      dbo.collection(col_ses).insertOne({seesion_id:req.sessionID,isAdmin:myobj.isAdmin},function (err, result) {
                                        if (err) throw err;
                                        res.end('welcome')
                                        console.log('welcom user'+req.session+"id"+req.sessionID)
                                      })
                                      db.close();

                              })
                      }
                      else {console.log('not same pass user'+req.body.PASS)
                            res.end(JSON.stringify(result)+'req not same'+JSON.stringify(req.body))
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
          
  
        