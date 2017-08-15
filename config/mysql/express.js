module.exports = function(){
  var express = require('express')
  var session = require('express-session');
  var bodyParser = require('body-parser');
  var mySQLStore = require('express-mysql-session')(session)
  var fs = require('fs')
  var app = express()
  app.use('/css',express.static('css'))
  app.use('/semantic',express.static('semantic'));
  app.set('views', './views')
  app.set('view engine', 'pug')
  app.use('/public', express.static('public'));
  app.locals.pretty = true
  app.use('/user', express.static('uploads'))
  app.use('/BGImgs', express.static('BGImages'))
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
  return app
}
