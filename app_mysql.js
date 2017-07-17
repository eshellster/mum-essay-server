var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);

var auth = require('./routes/mysql/auth')(passport)
app.use('/auth', auth)

var topic = require('./routes/mysql/topic')()
app.use('/topic', topic)

var multer = require('./routes/mysql/multer')(app)
app.use('/multer', multer)


app.listen(3000, function(){
  console.log('connection, 3000 port!')
})
