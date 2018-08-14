////adduser
exports.go=function (req, res) {
    const bcrypt = require('bcrypt');
    const MongoClient = require('mongodb').MongoClient
    const url = "mongodb://localhost:27017/"
    const saltRounds=10
    const col_ses="Sessions"
    const col_user="user"
    const DB="weather"
    var Bres ={comfirm:false}

    var myobj={email:req.body.email,isAdmin:req.body.isAdmin,status:true}
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(DB);
    ///////////////////////check Session All////////////
    dbo.collection(col_ses).find({session_id:req.sessionID}).toArray(function (err, result) {
        if(result.length>0) {console.log('U R login now')   }
        else{
            /////////////////check form input///////////////////
                req.checkBody('name', 'name Must have not Empty').isEmpty
                req.checkBody('email').isEmpty
                req.checkBody('email').isEmail
                req.checkBody('PASS', 'Password is Empty doit again').isEmpty
                req.checkBody('CONPASS', 'comfrim Password is Empty doit again').isEmpty
                req.checkBody('CONPASS', 'comfrim password is not math password').equals(req.body.PASS)
                const errorValidate = req.validationErrors();
                if (errorValidate) {console.log(JSON.stringify(errorValidate))} 
                else {
                        //////////////check have user///////////////////////
                        MongoClient.connect(url, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db(DB);                                              
                            dbo.collection(col_user).find(myobj).toArray(function (err, result) {
                                if(result.length>0) {console.log('have user')}
                                else {
                                    Bres.same=true
                                    myobj.name=req.body.name
                                    console.log('NO user')
                                    MongoClient.connect(url, function (err, db) {
                                        if (err) throw err;
                                        var dbo = db.db(DB);
                                            ////////////hash password///////////////
                                        var hash = bcrypt.hashSync(req.body.PASS, saltRounds);
                                        myobj.PASS = hash
                                        dbo.collection(col_user).insertOne(myobj, function (err, result) {
                                            if (err) throw err
                                        })      
                                    db.close()
                                    })                                
                                }                       
                            })                                              
                            db.close();
                        })
                }                                               
            }
    })                   
})
res.end(JSON.stringify(Bres)) 
}
                        