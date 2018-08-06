const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const validator =require('express-validator')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/"
const { check, validationResult } = require('express-validator/check');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore(
  {
    uri: 'mongodb://localhost:27017/',
    databaseName: 'weather',
    collection: 'Sessions'
  })
  const bcrypt = require('bcrypt');
  const app = express()
const saltRounds = 10;
app.use(validator())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors())
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
  extended: false
}))
 /* app.use(session({
  secret: 'keyboard cat',
   resave: false,
  saveUninitialized: true,
  cookie: { secure: true } })) 
 */
/////////////////////////////////////////////////////////////////////

///show all user
app.get('/showuser', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("weather");
    dbo.collection("user").find({}).toArray(function (err, result) {
      if (err) throw err;
      console.log("GET")
      console.log(result);
      res.end(JSON.stringify(result))
      db.close();
    });

  });

});
 
////login not available
/* app.get('/login',function(req,res){
  var dbo = db.db("weather")
   MongoClient.connect("user").find({}).toArray(url, function (err, db) {
     if (err) throw err
    var myobj = req.body
    res.end(JSON.stringify(myobj))
    })
         db.close();
    })
  })  */
////delete user
  app.post('/disableuser',function(req,res){
  var dbo = db.db("weather")
  
   MongoClient.connect(url, function (err, db) {
     if (err) throw err
    var myobj = req.body
    var newvalues = {
      $set: {
        status: "false"
      }
    }
  dbo.collection("user").updateOne(myobj,newvalues, function(err,result) {
    if (err) throw err;
    console.log(myobj+" is deleted")
    res.end(JSON.stringify(myobj))
    })
         db.close();
    })
  }) 
////adduser
app.post('/register', function (req, res) {
  req.checkBody('name','name Must have not Empty').isEmpty
  req.checkBody('email').isEmpty
  req.checkBody('email').isEmail
  req.checkBody('PASS','Password is Empty doit again').isEmpty
  req.checkBody('CONPASS','comfrim Password is Empty doit again').isEmpty
  req.checkBody('CONPASS','comfrim password is not math password').equals('PASS')
const errorValidate=req.validationErrors();
if(errorValidate)
{
  console.log(JSON.stringify(errorValidate))
  res.render('register')
}

  else{    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("weather");
      var myobj=req.body
      var hash = bcrypt.hashSync(req.body.PASS, saltRounds);
      myobj.PASS=hash
      dbo.collection("user").insertOne(myobj, function (error,resu) {
      if (error) throw error;
      res.end(JSON.stringify(myobj.name))
      });       
    console.log("ok")
    db.close();  
    }); }

  
});

app.post('/edituser', function (req, res) {
  /* if(req.body['email']==undefined|req.body['name']==undefined|req.body['PASS']==undefined)
    {console.log(err);throw("ERROR")}  */
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("weather");
      var myobj = req.body
      if (1) {
  var newvalues = {
    $set: {
      PASS: req.body  }
    }
    dbo.collection("user").updateOne(myobj, newvalues, function (err, result) {
    if (err) throw err;
    res.end(JSON.stringify(req.body))

  });
}

    console.log("ok")
    db.close();});  
});

///////////////////////////////////////////////////////////////////////////////
  
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Application run at http://%s:%s", host, port)
})

function newFunction(err) {
  if (err)
    throw err;
}



