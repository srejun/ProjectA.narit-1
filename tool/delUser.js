
exports.go = function (req, res) {

  const MongoClient = require('mongodb').MongoClient
  const url = "mongodb://localhost:27017/"
  const col_ses = "Sessions"
  const col_user = "user"
  const DB = "DataSensor"
  var value = { confirm: false, err: null }
  var myobj = { email: req.body.email, status: true, name: req.body.name }
  var newvalues = { $set: { status: false } }
  var have_ses = null
  var have_use = null
  var hour = 3 * 60 * 60 * 1000
  req.session.cookie.expires = new Date(Date.now() + hour)
  req.session.cookie.maxAge = hour
  req.checkBody('email').isEmpty
  req.checkBody('email').isEmail
  req.checkBody('name').isEmpty
  const errorValidate = req.validationErrors();
  if (errorValidate) {
    console.log(JSON.stringify(errorValidate)), res.end(JSON.stringify(value))
  }
  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db(DB);
    have_ses = await dbo.collection(col_ses).find({ session_id: req.sessionID, isAdmin: true }).toArray()
    have_use = await dbo.collection(col_user).find(myobj).toArray()
    if (have_ses.length > 0) {
      if (have_ses[0].email == myobj.email) { value.confirm = false, value.err = 'del your self' } else {
        console.log('delete user form col_ses,col_use'), value.confirm = true
        await dbo.collection(col_ses).deleteMany(
          { name: myobj.name, email: myobj.email }
        )
        await dbo.collection(col_user).updateOne(myobj, newvalues)
      }
    }
    else if (have_ses.length <= 0) { value.confirm = false, value.err = "สำหรับแอดมินเท่านั้น", console.log('not admin') }
    else if (have_use.length <= 0) { value.confirm = false, value.err = 'ไม่มีผู้ใช้นี้ในระบบ', console.log('No user in DB') }

    console.log("value=" + JSON.stringify(value) + JSON.stringify(req.session.cookie.expires) + JSON.stringify(req.sessionID))
    res.end(JSON.stringify(value))
    db.close()
  })
}