var express = require('express');
var app = express()

app.set('view engine', 'pug')
app.set('views', './views')
app.get('/view', function(req, res){
  res.render('view')
})
app.get('/add', function(req, res){
  res.render('add')
})
app.listen(3000, function() {
  console.log('connected 3000 port.');
})
