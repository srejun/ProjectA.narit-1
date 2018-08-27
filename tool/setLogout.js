exports.go = function (req, res) {
  const MongoClient = require('mongodb').MongoClient
  const url = "mongodb://localhost:27017/"
  const col_ses = "Sessions"
  const DB = "DataSensor"

  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db(DB);
    var del = await dbo.collection(col_ses).deleteOne({ session_id: req.sessionID })
    if (del.deletedCount > 0) {
      res.end('log out')
      req.session.destroy(function (err) {
        if (err) {
          console.log(err);
        }
      })
    }
    else {
      res.end('no session math')
      console.log('no session math' + req.sessionID)
    }
    db.close();
  })

}

