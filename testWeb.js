var app = require('./config/mysql/express')();



app.get('/index',function(req, res) {
  res.render('testweb')
})


app.listen(3000, function(){
  console.log('connection, 3000 port!')
})
