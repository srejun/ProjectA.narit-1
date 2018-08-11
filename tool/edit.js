exports.go=function(req,res){
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb').MongoClient
  const url = "mongodb://localhost:27017/"
  const col_ses="Sessions"
  const col_user="user"
  const DB="weather"
  const saltRounds=10
  var myobj = {name:req.body.name,email:req.body.email,status:true,isAdmin:false} ///admin can't change other admin password
  var newvalues = {$set: { PASS: req.body.NewPass}}
  ///////////////////check admin session//////////////////
  MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(DB);
      dbo.collection(col_ses).find({session_id:req.sessionID,isAdmin:true}).toArray(function (err, result) {
          if(result.length<=0) {console.log('U R NOT admin'),res.end('NOT admin')    }
          else{
              ////////////check form /////////////////////
                req.checkBody('name', 'name Must have not Empty').isEmpty
                req.checkBody('email').isEmpty
                req.checkBody('email').isEmail
                req.checkBody('PASS', 'Password is Empty doit again').isEmpty
                req.checkBody('CONPASS', 'comfrim Password is Empty doit again').isEmpty
                req.checkBody('CONPASS', 'comfrim password is not math password').equals(req.body.PASS)
                const errorValidate = req.validationErrors();
                    if (errorValidate) {console.log(JSON.stringify(errorValidate))}   
                    else {
                        //////////////////have user//////////////////
                        MongoClient.connect(url, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db(DB);
                            dbo.collection(col_user).find(myobj).toArray(function (err, result) {
                                if(result.length<=0) {console.log('NOuser Math'), res.end('No user')   }
                                else {
                                    ///////////update user///////////
                                    console.log('Update user ')
                                    MongoClient.connect(url, function (err, db) {
                                         if (err) throw err;
                                        var dbo = db.db(DB);        
                                        var hash = bcrypt.hashSync(req.body.PASS, saltRounds);
                                        newvalues.PASS=hash
                                       dbo.collection(col_user).updateOne(myobj, newvalues, function (err, result) {
                                            if (err) throw err;
                                        res.end(JSON.stringify(myobj))  
            
                                        });
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
}
                