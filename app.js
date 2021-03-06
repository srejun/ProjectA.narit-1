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
  origin:['http://pc.devinice.com:1112','http://localhost:8080','http://103.74.255.214:8080'],
  //origin:['http://localhost:8080'],
  methods:['GET','POST'],
  credentials: true ,// enable set cookie
}));
app.use(bodyParser.urlencoded({
  extended: false
}))
//  const clientSessions = require("client-sessions");
// app.use(clientSessions({
//   secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK' // set this to a long random string!
// })); 
app.use(/* session({
  secret: 'keyboard cat555',
  cookieName: 'mySession',
  resave:false,
  saveUninitialized:true


}) */
session({
  secret: 'keyboard cat',
  cookie: { },
  resave: true,
  saveUninitialized: true
})
)

/////////////////////////////////////////////////////////////////////

///show all user only admin can see all admin & user
var getUsers=require('./tool/getUsers')
app.post('/getUsers',getUsers.go )

///logout user&admin
var setLogout=require('./tool/setLogout')
app.post('/setLogout', setLogout.go);


///login user&admin
var setLogin=require('./tool/setLogin')
app.post('/setLogin',setLogin.go)

////delete user&admin
var delUser=require('./tool/delUser')
app.post('/delUser',delUser.go)
///regis,add user&admin
var newUser=require('./tool/newUser')
app.post('/newUser', newUser.go)

var dataInput = require('./tool/dataInput')
app.post('/api/dataInput', dataInput.go)

var getDatas = require('./tool/getDatas')
app.post('/api/getDatas', getDatas.go)

var newLocation = require('./tool/newLocation')
app.post('/api/newLocation', newLocation.go)

var getDatabyTime = require('./tool/getDatabytime')
app.post('/api/getDatabyTime', getDatabyTime.go)

var getLocations = require('./tool/getLocations')
app.post('/api/getLocations', getLocations.go)

var delLocation = require('./tool/delLocation')
app.post('/api/delLocation', delLocation.go)

var getDay = require('./tool/getDay')
app.post('/api/getDay', getDay.go)

var getMonth = require('./tool/getMonth')
app.post('/api/getMonth', getMonth.go)

var getYear = require('./tool/getYear')
app.post('/api/getYear', getYear.go)
var getMYear = require('./tool/getManyYear')
app.post('/api/getMYear', getMYear.go)

var getCustom = require('./tool/getCustom')
app.post('/api/getCustom', getCustom.go)

var examInput = require('./tool/examinput')
app.post('/api/examInput', examInput.go)

var test = require('./tool/test')
app.post('/api/test', test.go) //sensor input update data

var getFlags = require('./tool/getFlags')
app.post('/api/getFlags', getFlags.go)

var setTrain = require('./tool/setTrain')
app.post('/api/setTrain', setTrain.go)

var getTrain = require('./tool/getTrain')
app.post('/api/getTrain', getTrain.go)
///////////////////////////////////////////////////////////////////////////////

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Application run at http://%s:%s", host, port)
})
