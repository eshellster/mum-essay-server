
var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport)

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


app.use('/auth/', auth)
app.listen(3000, function() {
  console.log('Connected 3000 port!');
})
