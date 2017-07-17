module.exports = function(passport){

  var route = require('express').Router();
  var bkfd2Password = require("pbkdf2-password")
  var hasher = bkfd2Password();
  var connection = require('../../config/mysql/db')()

  route.get('/register', function(req, res){
    res.render('mysql/auth/register')
  })

  route.post('/register', function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
      var user = {
        authId:'local:'+req.body.username,
        username:req.body.username,
        password:hash,
        salt:salt,
        phone:req.body.phone,
        email:req.body.email,
        displayName:req.body.displayName
      }
      var sql = 'INSERT INTO member SET ?'
      // connection.query(sql, Object.keys(user), Object.values(user), function(err, results) {
      connection.query(sql, user, function(err, results) {
        if(err){
          console.log(err);
          res.status(500)
        }else{
          req.login(user, function(){
            req.session.save(function(){
                res.redirect('/topic')
            })
          })
        }
      })
    })
  })

  route.post('/login',
    passport.authenticate('local', { successRedirect: '/topic',
                                     failureRedirect: '/auth/login',
                                     failureFlash: false })
  );

  route.get('/login', function(req, res){
    res.render('mysql/auth/login')
  })

  route.get('/logout', function(req, res){
    req.logout()
    req.session.save(function(){
      res.redirect('/topic')
    })
  })

  route.get('/edit', function(req, res) {
    res.render('mysql/auth/edit')
  })

  return route
}
