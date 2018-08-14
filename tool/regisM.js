exports.go= async function (req, res) {
    const bcrypt = require('bcrypt');
    const MongoClient = require('mongodb').MongoClient
    const url = "mongodb://localhost:27017/"
    const saltRounds=10
    const col_ses="Sessions"
    const col_user="user"
    const DB="weather"
    var Bres ={confirm: false}
    var myobj={email:req.body.email,isAdmin:req.body.isAdmin,status:true,name:req.body.name}
    var hav_ses=null
    var have_use=null
    var math=null 
    var login=null



    req.checkBody('name', 'name Must have not Empty').isEmpty
    req.checkBody('email').isEmpty
    req.checkBody('email').isEmail
    req.checkBody('PASS', 'Password is Empty doit again').isEmpty
    req.checkBody('CONPASS', 'comfrim Password is Empty doit again').isEmpty
    req.checkBody('CONPASS', 'comfrim password is not math password').equals(req.body.PASS)
    const errorValidate = req.validationErrors();
    if (errorValidate) {console.log(JSON.stringify(errorValidate)),res.end(JSON.stringify(Bres))
    } 



  MongoClient.connect(url,async function (err, db) {
    if (err) throw err;
    var dbo = db.db(DB);
    hav_ses = await dbo.collection(col_ses).find({session_id:req.sessionID,name:myobj.name}).toArray() ////check session
    var hash = bcrypt.hashSync(req.body.PASS, saltRounds);//hash pass word
    myobj.PASS = hash
    have_use= await dbo.collection(col_user).find({email:myobj.email}).toArray() ///have user by email
    if(hav_ses<=0&&have_use.length<=0)
        {dbo.collection(col_user).insertOne(myobj),Bres.confirm=true         ///insert user                                     
         console.log('insert complete') }
    else if(hav_ses<=0&&have_use.length>0)console.log('same user')
    else console.log('you are login now')
    res.end(JSON.stringify(Bres)) ,db.close()
  })




}