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
app.use(cors())
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

///show all user only admin can see all admin & user
var show=require('./tool/show')
app.post('/showuser',show.go )

///logout user&admin
var Lout=require('./tool/logout')
app.post('/logout', Lout.go);


///login user&admin
var Lin=require('./tool/login')
app.post('/login',Lin.go)

////delete user&admin
var del=require('./tool/dis')
app.post('/disableuser',del.go)
///regis,add user&admin
var reg=require('./tool/regis')
app.post('/register', reg.go)
      
//edit password///          
var Cpass=require('./tool/edit')
app.post('/edituser', Cpass.go);


///////////////////////////////////////////////////////////////////////////////

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Application run at http://%s:%s", host, port)
})
