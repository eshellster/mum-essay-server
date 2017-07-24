
module.exports = function(app) {

  var connection = require('./db')()
  var bkfd2Password = require("pbkdf2-password")
  var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
  var hasher = bkfd2Password();

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done){
    console.log('---- serializeuser : ',user)
    done(null, user.authId)
  })

  passport.deserializeUser(function(id, done) {
    var sql = 'SELECT * FROM member WHERE authId=?'
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
      var sql = 'SELECT * FROM member WHERE authId=?'
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



  return passport
}
