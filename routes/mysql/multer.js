module.exports = function(){
  var route = require('express').Router()
  var multer = require('multer');


  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  var upload = multer({ storage: storage })

  route.get('/upload', function(req, res){
    res.render('topic/uploadform')
  })

  route.post('/upload', upload.single('userfile'), function(req, res){
    console.log(req.file)
    res.send('Uploaded :'+req.file.originalname)
  })
  

  return route
}
