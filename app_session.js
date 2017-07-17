var express = require('express')
var session = require('express-session');
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password")
var mySQLStore = require('express-mysql-session')(session)
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var mysql      = require('mysql')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'eshell4274',
  database : 'o2'
})
connection.connect();

var app = express()
var hasher = bkfd2Password();
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'kjaljdhhad34@$%@$#**sho&$%^akjdsha',
  resave: false,
  saveUninitialized: true,
  store: new mySQLStore({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'eshell4274',
    database:'o2'
  })
}))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
  console.log('---- serializeuser : ',user)
  done(null, user.authId)
})

passport.deserializeUser(function(id, done) {
  console.log('++++ deserializeuser : ', id)
  var sql = 'SELECT * FROM users WHERE authId=?'
  connection.query(sql, [id], function(err,results){
    if(err){
      console.log('There is no user.');
    }else{
      done(null, results[0])
    }
  })
})

passport.use(new LocalStrategy(
  function(username, password, done) {
    var uname = username
    var pwd = password
    var sql = 'SELECT * FROM users WHERE authId=?'
    connection.query(sql,['local:'+uname],function(err, results){
      if(err){
        console.log(err);
        return done('------ there is no user.-------')
      }
      var user = results[0]
      return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
        if(hash === user.password){
          console.log('LocalStrategy : ',user);
          done(null, user)
        }else{
          done(null, false)
          console.log('페스워드가 틀림');
        }
      })
    })
  }
));

app.get('/auth/register', function(req, res){
  var output = `
  <h1>Login</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="username" >
    </p>
    <p>
      <input type="text" name="password" placeholder="password" >
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName" >
    </p>
    <p>
      <input type="submit" value="등록" >
    </p>
  </form>

  `
  res.send(output)
})

app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      authId:'local:'+req.body.username,
      username:req.body.username,
      password:hash,
      salt:salt,
      displayName:req.body.displayName
    }
    var sql = 'INSERT INTO users SET ?'
    // connection.query(sql, Object.keys(user), Object.values(user), function(err, results) {
    connection.query(sql, user, function(err, results) {
      if(err){
        console.log(err);
        res.status(500)
      }else{
        req.session.save(function(){
            res.redirect('/welcome')
        })

      }
    })
  })
})

app.post('/auth/login',
  passport.authenticate('local', { successRedirect: '/welcome',
                                   failureRedirect: '/auth/login',
                                   failureFlash: false })
);

app.get('/auth/login', function(req, res){
  var output = `
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="username" >
    </p>
    <p>
      <input type="text" name="password" placeholder="password" >
    </p>
    <p>
      <input type="submit" value="로그인" >
    </p>
  </form>

  `
  res.send(output)
})

app.get('/auth/logout', function(req, res){
  req.logout()
  req.session.save(function(){
    res.redirect('/welcome')
  })
})

app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName){
    res.send(
      `<h1>${req.user.displayName}</h1>
      <a href="/auth/logout">Logout</a>
      `
    )
  }else{
    var out =
    `
    <li>
        <a href="/auth/login">Login</a>
    </li>
    <li>
        <a href="/auth/register">Register</a>
    </li>
    `
    res.send(`<h1>Welcome</h1><ul>${out}</ul>`)
  }


})

app.get('/count', function(req, res) {
  if(req.session.count){
    req.session.count++
  }else{
    req.session.count = 1
  }
  res.send('result : ' +req.session.count)
})

app.get('/tmp', function (req, res) {
  res.send('result : '+ req.session.count)
})

app.listen(3000, function() {
  console.log('Connected 3000 port!');
})
