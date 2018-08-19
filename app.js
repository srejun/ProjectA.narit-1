const express = require('express')/////
const bodyParser = require('body-parser')//////
const cookieParser = require('cookie-parser')///////
const session = require('express-session')//////
const validator = require('express-validator')//////
const cors = require('cors')//////
const app = express()
app.use(validator())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({
  origin:['http://localhost:8080'],
  methods:['GET','POST'],
  credentials: true ,// enable set cookie
  cookie:{maxAge:60*1000*60*3}
}));
app.use(bodyParser.urlencoded({
  extended: false
}))
 const clientSessions = require("client-sessions");
app.use(clientSessions({
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK' // set this to a long random string!
})); 
app.use(session({
  secret: 'keyboard cat555',
  cookieName: 'mySession',
  duration: 60*1000*60*3,
  cookie:{maxAge:60*1000*60*3},
  resave:false,
  saveUninitialized:true


}))

/////////////////////////////////////////////////////////////////////

///show all user only admin can see all admin & user
var show=require('./tool/show')
app.post('/showuser',show.go )

///logout user&admin
var Lout=require('./tool/logoutM')
app.post('/logout', Lout.go);


///login user&admin
var Lin=require('./tool/loginM')
app.post('/login',Lin.go)

////delete user&admin
var del=require('./tool/disM')
app.post('/disableuser',del.go)
///regis,add user&admin
var reg=require('./tool/regisM')
app.post('/register', reg.go)
      
//edit password///          
var Cpass=require('./tool/editM')
app.post('/edituser', Cpass.go);


///////////////////////////////////////////////////////////////////////////////

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Application run at http://%s:%s", host, port)
})
