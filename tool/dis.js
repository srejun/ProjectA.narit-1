exports.go=function (req, res) {
  const MongoClient = require('mongodb').MongoClient
  const url = "mongodb://localhost:27017/"
        ///////////////check session admin/////////////////////
  const col_ses="Sessions"
  const col_user="user"
  const DB="weather"
  var myobj = {name:req.body.name,email:req.body.email,status:true,isAdmin:req.body.isAdmin} 
  var newvalues = {$set: { status: false}}////disable user&admin
  MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(DB);
      dbo.collection(col_ses).find({session_id:req.sessionID,isAdmin:true}).toArray(function (err, result) {
          if(result.length<=0) {console.log('U R NOT admin'),res.end('NOT admin')    }
          /////////////////////////////////////////////////////
          else { req.checkBody('name', 'name Must have not Empty').isEmpty
              req.checkBody('email').isEmpty
              req.checkBody('email').isEmail
              const errorValidate = req.validationErrors();
                if (errorValidate) {console.log(JSON.stringify(errorValidate))} 
                else {
                /////////////////check have user/////////////////////
                    MongoClient.connect(url, function (err, db) {
                      if (err) throw err;
                      var dbo = db.db(DB);
                      dbo.collection(col_user).find(myobj).toArray(function (err, result) {
                          if(result.length<=0) {console.log('NO user'),res.end('No user enable')  }
                        /////////////////////////////////////////////
                          else {
                            console.log(" Have user")
                            MongoClient.connect(url, function (err, db) {
                              if (err) throw err;
                              var dbo = db.db(DB);
                              console.log('NO user')
                              
                            /////////////////////disable user&admin//////////////////////
                              dbo.collection(col_user).updateOne(myobj, newvalues, function (err, result) {
                                if (err) throw err;
                                console.log(myobj.name + " is deleted"+result)
                                res.end(JSON.stringify(myobj))
                              }) 
                              db.close();
                            })
                          }                        
                      })
                    db.close();                
                    })
                }
          }
      })
  })
  db.close();
}
    
    
    
  