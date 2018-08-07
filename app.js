const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const validator = require('express-validator')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/"
const {
  check,
  validationResult
} = require('express-validator/check');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({
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
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    secure: true
  }
}))

/////////////////////////////////////////////////////////////////////

///show all user
app.post('/showuser', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("weather");
    dbo.collection("user").find({status:true}).toArray(function (err, result) {
      req.session
      if (err) throw err;
      console.log("GET")
      console.log(result);
      console.log(req.session);
      res.end(JSON.stringify(result))
      db.close();
    });

  });

});



///login
app.post('/login', function (req, res) {
  req.checkBody('name', 'name Must have not Empty').isEmpty
  req.checkBody('email').isEmpty
  req.checkBody('email').isEmail
  req.checkBody('PASS', 'Password is Empty doit again').isEmpty
  const errorValidate = req.validationErrors();
  if (errorValidate) {
    console.log(JSON.stringify(errorValidate))
    //res.render('register')
  } else {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("weather");

      ///////////////////////////////////
      dbo.collection("user").find({name:req.body.name,email:req.body.email,status:true}).toArray(function (err, result) {
          if(result.length<=0) {console.log('NO user')
          res.end('NO user')     
        }
          else {
            console.log(typeof(req.body.PASS))
             bcrypt.compare(req.body.PASS,result[0].PASS, function(err, respone) {
              if(respone)    {console.log('welcom user')
              res.end('welcome')}
            else {console.log('not same pass user'+req.body.PASS)
              res.end(JSON.stringify(result)+'req not same'+JSON.stringify(req.body))}

          }); 
            }
      

      })
      ///////////////////////////////////////
      //console.log()  
     console.log("ok")
      db.close();
    })
          }
        

      })

////delete user
app.post('/disableuser', function (req, res) {
  req.checkBody('name', 'name Must have not Empty').isEmpty
  req.checkBody('email').isEmpty
  req.checkBody('email').isEmail
  const errorValidate = req.validationErrors();
  if (errorValidate) {
    console.log(JSON.stringify(errorValidate))
    //res.render('register')
  } else {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("weather");
      ///////////////////////////////////
      dbo.collection("user").find({name:req.body.name,email:req.body.email,status:true}).toArray(function (err, result) {
          if(result.length<=0) {console.log('NO user')
          res.end('No user enable')     
        }
          else {
            console.log(" Have user")
            MongoClient.connect(url, function (err, db) {
              if (err) throw err;
              var dbo = db.db("weather");
            console.log('NO user')
              var myobj = req.body
              myobj.status=true
              var newvalues = {$set: { status: false}}
              dbo.collection("user").updateOne(myobj, newvalues, function (err, result) {
                if (err) throw err;
                console.log(myobj.name + " is deleted"+result)
                res.end(JSON.stringify(myobj))
              }) 
              db.close();
            })
            //////////////////////
            }
      

      })
      ///////////////////////////////////////
      //console.log()  
     console.log("ok")
      db.close();
    })
          }

})



////adduser
app.post('/register', function (req, res) {
  req.checkBody('name', 'name Must have not Empty').isEmpty
  req.checkBody('email').isEmpty
  req.checkBody('email').isEmail
  req.checkBody('PASS', 'Password is Empty doit again').isEmpty
  req.checkBody('CONPASS', 'comfrim Password is Empty doit again').isEmpty
  req.checkBody('CONPASS', 'comfrim password is not math password').equals(req.body.PASS)
  const errorValidate = req.validationErrors();
  if (errorValidate) {
    console.log(JSON.stringify(errorValidate))
    //res.render('register')
  } else {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("weather");

      ///////////////////////////////////
      dbo.collection("user").find({name:req.body.name,status:true,email:req.body.email}).toArray(function (err, result) {
          if(result.length>0) {console.log('have user')
          res.end('same user')     
        }
          else {
            console.log('NO user'+result[0])
            MongoClient.connect(url, function (err, db) {
              if (err) throw err;
              var dbo = db.db("weather");
            ///////////////////////////
            var myobj = {name:req.body.name,email:req.body.email,PASS:req.body.PASS,status:true}
            var hash = bcrypt.hashSync(req.body.PASS, saltRounds);
            myobj.PASS = hash
            dbo.collection("user").insertOne(myobj, function (err, result) {
                if (err) throw err
            res.end(JSON.stringify(myobj)) 
                })      
                db.close();
              })
            //////////////////////
            }
      

      })
      ///////////////////////////////////////
      //console.log()  
     console.log("ok")
      db.close();
    })
          }
        

      })

     
      
            

app.post('/edituser', function (req, res) {
  /* if(req.body['email']==undefined|req.body['name']==undefined|req.body['PASS']==undefined)
    {console.log(err);throw("ERROR")}  */
    req.checkBody('name', 'name Must have not Empty').isEmpty
      req.checkBody('email').isEmpty
      req.checkBody('email').isEmail
      req.checkBody('PASS', 'Password is Empty doit again').isEmpty
      req.checkBody('CONPASS', 'comfrim Password is Empty doit again').isEmpty
      req.checkBody('CONPASS', 'comfrim password is not math password').equals(req.body.PASS)
      const errorValidate = req.validationErrors();
      if (errorValidate) {
        console.log(JSON.stringify(errorValidate))
        //res.render('register')
      } else {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db("weather");
    
          ///////////////////////////////////
          
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("weather");
    dbo.collection("user").find({name:req.body.name,email:req.body.email,status:true}).toArray(function (err, result) {
      if(result.length<=0) {console.log('NOuser Math')
      res.end('No user')     
    }
      else {
        console.log('Update user ')
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db("weather");
        ///////////////////////////
        var myobj = {name:req.body.name,email:req.body.email,PASS:req.body.PASS}
        var hash = bcrypt.hashSync(req.body.PASS, saltRounds);
        myobj.PASS = hash
        var newvalues = {
          $set: {
            PASS: myobj.PASS
          }
        }
        dbo.collection("user").updateOne({name:myobj.name,email:myobj.email,status:true}, newvalues, function (err, result) {
          if (err) throw err;
          res.end(JSON.stringify(myobj))
  
        });
            db.close();
          })
        //////////////////////
        }
  

  })
  ///////////////////////////////////////
  //console.log()  
 console.log("ok")
  db.close();
})
      })

   
  }
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