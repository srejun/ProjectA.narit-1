exports.go=function (req, res) {
  const MongoClient = require('mongodb').MongoClient
  const url = "mongodb://localhost:27017/"
  const col_ses="Sessions"
  const col_user="user"
  const DB="weather"
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } 
  })
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(DB);
      dbo.collection( col_ses).deleteOne({seesion_id:req.sessionID},function (err, result) {
        if (result>0) {console.log('have user logout'),res.end('log out')}
        else { res.end('no session math'),console.log('no session math'+req.sessionID+req.session) }
        db.close();
      })
  
    })
  
  }