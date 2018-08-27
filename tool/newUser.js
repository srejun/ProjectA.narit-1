exports.go = async function (req, res) {
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb').MongoClient
  const url = "mongodb://localhost:27017/"
  const saltRounds = 10
  const col_ses = "Sessions"
  const col_user = "user"
  const DB = "DataSensor"
  var value = { confirm: false, err: null }
  var myobj = { email: req.body.email, isAdmin: req.body.isAdmin, status: true, name: req.body.name }
  var have_ses = null
  var have_use = null



  req.checkBody('name', 'name Must have not Empty').isEmpty
  req.checkBody('email').isEmpty
  req.checkBody('email').isEmail
  req.checkBody('PASS', 'Password is Empty doit again').isEmpty
  req.checkBody('CONPASS', 'comfrim Password is Empty doit again').isEmpty
  req.checkBody('CONPASS', 'comfrim password is not math password').equals(req.body.PASS)
  const errorValidate = req.validationErrors();
  if (errorValidate) {
    console.log(JSON.stringify(errorValidate))
    res.end(JSON.stringify(value))
    value.err = 'error validate'
  }



  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db(DB);
    have_ses = await dbo.collection(col_ses).find({ session_id: req.sessionID, isAdmin: true }).toArray() ////check session
    var hash = bcrypt.hashSync(req.body.PASS, saltRounds);//hash pass word
    myobj.PASS = hash
    have_use = await dbo.collection(col_user).find({ email: myobj.email, status: true }).toArray() ///have user by email
    if (have_ses.length <= 0) {
      console.log('permission denied')
      value.err = 'permission denied'
      res.end(JSON.stringify(value));
    }
    else {
      if (have_use.length > 0) {
        console.log('same user')
        value.err = 'same user'
        res.end(JSON.stringify(value));
      }
      else {
        dbo.collection(col_user).insertOne(myobj)
        value.confirm = true         ///insert user                                     
        console.log('insert complete')
        res.end(JSON.stringify(value));
      }
    }
  })




}