module.exports = function(){
  var route = require('express').Router()
  var connection = require('../../config/mysql/db')()
  var imagesUrl='http://eshell.iptime.org/server_mum/uploads/'
  var bgimgUrl='http://eshell.iptime.org/server_mum/BGImages/'
  var sourceimgUrl='http://eshell.iptime.org/server_mum/sourceImages/'
// multer
  var multer = require('multer');


  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, 'photo-'+Date.now())
    }
  })
  var upload = multer({ storage: storage })

 //배경이미지
 var bgStorage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'BGImages/')
   },
   filename: function (req, file, cb) {
     cb(null, 'bgimg_'+Date.now()+'-'+file.originalname)
   }
 })
 var bgUpload = multer({ storage: bgStorage })
/// multer

  route.get('/add',function(req, res){
    var sql = 'SELECT id,name FROM person'
    var param = []
    if(req.user){
      var sql = 'SELECT id,name FROM person WHERE campursID=?'
      var param = [req.user.id]
    }
    connection.query(sql,param, function(err, rows, fields){
      res.render('mysql/topic/add',{topics:rows, user:req.user, imagesUrl})
    })
  })

  route.post('/add', upload.single('userfile'), function(req, res) {
    var campursID = req.user.id
    var name = req.body.name
    var course = req.body.course
    var level = req.body.level
    var school = req.body.school
    var grade = req.body.grade
    var photoName = req.file.originalname
    var photoId = req.file.filename
    var topic = req.body.topic
    var sql = 'INSERT INTO person (campursID, name, course, level, school, grade, photoName, photoId, topic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    var param = [campursID, name, course, level, school, grade, photoName, photoId, topic]
    connection.query(sql, param, function(err, rows, fields) {
      if(err){
        console.log(err);
      }else {
        res.redirect('/topic/'+rows.insertId)
      }
    })
  })

  route.get('/:id/edit',function(req, res){
    var id = req.params.id
    var sql = 'SELECT id,name FROM person'
    var param = []
    //캠퍼스 등록생만 보기
    if(req.user && (req.user.username != '김성범')){
      var sql = 'SELECT id,name FROM person WHERE campursID=?'
      var param = [req.user.id]
    }
    connection.query(sql,param, function(err, rows, fields){
      if(err){
        console.log(err);
      }
      else{
        var sql = 'SELECT * FROM person WHERE id=?'
        var param = [id]
        connection.query(sql, param, function(err, row, fields){
           res.render('mysql/topic/edit',{topics:rows, topic:row[0], user:req.user})
        })
      }
    })
  })

  route.post('/:id/edit',function(req, res) {
    var id = req.params.id
    var name = req.body.name
    var course = req.body.course
    var level = req.body.level
    var school = req.body.school
    var grade = req.body.grade
    var topic = req.body.topic
    var sql = 'UPDATE person SET name=?, course=?, level=?, school=?, grade=?, topic=? WHERE id=?'
    var param = [name, course, level, school, grade, topic, id]
    connection.query(sql, param, function(err, rows, fields) {
      if(err){
        console.log(err);
      }else {
        res.redirect('/topic/'+id)
      }
    })
  })

  route.get('/:id/addBGImg', function(req, res){
    var id = req.params.id
    res.render('mysql/topic/addBGImgId',{id:id})
  })

  route.post('/:id/addBGImg',bgUpload.single('userfile'), function(req, res){
    var id = req.params.id
    var bgDisplayName = req.body.displayName
    var bgFileName = req.file.filename
    var sql = 'INSERT INTO BGImages (fileName, displayName) VALUES (?,?)'
    var param = [bgFileName, bgDisplayName]
    connection.query(sql, param, function(err, rows, fields){
      if(err){
        console.log(err);
      }
      else{
        var sql = 'UPDATE person SET bgFileName=?, bgDisplayName=? WHERE id=?'
        var param = [bgFileName, bgDisplayName, id]
        connection.query(sql, param, function(err, row, fields){
          if(err){
            console.log(err);
          }
          else{
            res.redirect('/topic/'+id)
          }
        })
      }
    })
  })



  route.get('/:id/selectBGImg',function(req, res) {
    var id= req.params.id
    var sql = 'SELECT bgFileName,bgDisplayName FROM person WHERE id=?'
    var param = [id]
    connection.query(sql, param, function(err, person, fields){
      console.log(person);
      if(err){
        console.log(err);
      }
      else {
        var sql = 'SELECT * FROM BGImages'
        connection.query(sql, function(err, imgList, fields){
          imgList.sort(function (a, b) {
            return a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0;
            });
          res.render('mysql/topic/selectBGImage',{person:person, imgList:imgList, id:id})
        })
      }
    })
  })

  route.post('/:id/selectBGImg',function(req, res) {
    var id = req.params.id
    var fileName = req.body.fileName
    var sql = 'UPDATE person SET bgFileName=? WHERE id=?'
    var param = [fileName, id]
    connection.query(sql, param, function(err, rows, fields) {
      if(err){
        console.log(err);
      }else {
        res.redirect('/topic/'+id)
      }
    })
  })

  route.get('/:id/photoEdit',function(req, res){
    var id = req.params.id
    var sql = 'SELECT id,name FROM person'
    var param = []
    //캠퍼스 등록생만 보기
    if(req.user && (req.user.username != '김성범')){
      var sql = 'SELECT id,name FROM person WHERE campursID=?'
      var param = [req.user.id]
    }
    connection.query(sql,param, function(err, rows, fields){
      if(err){
        console.log(err);
      }
      else{
        var sql = 'SELECT * FROM person WHERE id=?'
        var param = [id]
        connection.query(sql, param, function(err, row, fields){
           res.render('mysql/topic/photoEdit',{topics:rows, topic:row[0], user:req.user, imagesUrl})
        })
      }
    })
  })

  route.post('/:id/photoEdit', upload.single('userfile'), function(req, res) {
    var id = req.params.id
    var photoName = req.file.originalname
    var photoId = req.file.filename
    var sql = 'UPDATE person SET photoId=?, photoName=? WHERE id=?'
    var param = [photoId, photoName, id]
    connection.query(sql, param, function(err, rows, fields) {
      if(err){
        console.log(err);
      }else {
        res.redirect('/topic/'+id)
      }
    })
  })

  route.get('/:id/delete',function(req, res){
    var id = req.params.id
    var sql = 'SELECT id, name FROM person'
    var param = []
    if(req.user){
      var sql = 'SELECT id,name FROM person WHERE campursID=?'
      var param = [req.user.id]
    }
    connection.query(sql,param, function(err, rows, fields){
      if(err){
        console.log(err);
      }
      else{
        var sql = 'SELECT * FROM person WHERE id=?'
        var param = [id]
        connection.query(sql, param, function(err, row, fields){
           res.render('mysql/topic/delete',{topics:rows, topic:row[0], user:req.user})
        })
      }
    })

  })

  route.post('/:id/delete',function(req, res) {
    var id = req.params.id
    var sql = 'DELETE FROM person WHERE id=?'
    var param = [id]
    connection.query(sql, param, function(err, rows, fields) {
      if(err){
        console.log(err);
      }else {
        res.redirect('/topic')
      }
    })
  })


  // topic 페이지

  route.get('/present', function(req, res){
    var sql = 'SELECT displayName, id FROM member'
    connection.query(sql, function(err, rows, fields) {
      rows.sort(function (a, b) {
        return a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0;
        });
      // res.send(rows)
      // res.render('mysql/topic/present',{campurs:rows})
      var sql = 'SELECT * FROM person'
      connection.query(sql, function(err, person, fields) {
        var list = []
        person.sort(function (a, b) {
          return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          });
        for(i=0;i<rows.length;i++){
          // console.log(rows[i].id);
          for(j=0;j<person.length;j++){
            // console.log(person.length);
            if(rows[i].id==person[j].campursID){
              person[j].campurs=rows[i].displayName
              list.push(person[j])
            }
          }
        }
        res.render('mysql/topic/present',{person:list})
      })

    })
  })

  route.get('/memberlist', function(req, res){
    var sql = 'SELECT * FROM member'
    connection.query(sql, function(err, members, fields) {
      // members.sort(function (a, b) {
      //   return a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0;
      //   });
      members.sort(function (a, b) {
        return a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0;
        });
      res.render('mysql/topic/memberlist',{members:members})
    })
  })

  route.get('/:id/render', function(req, res){
    var id = req.params.id
    var sql = 'SELECT * FROM person WHERE memberOrder=?'
    var param = id
    connection.query(sql,param, function(err, row, fields) {
      if(err){
        console.log(err);
      }else {
        var sql = 'SELECT displayName FROM member WHERE id=?'
        var param = row[0].campursID
        connection.query(sql,param, function(err, campursName, fields){
          res.render('mysql/topic/render',{ topic:row[0], imagesUrl:imagesUrl, bgimgUrl:bgimgUrl, campursName:campursName[0]})
        })
      }
    })
  })

  route.get('/:id/preview', function(req, res){
    var id = req.params.id
    var sql = 'SELECT * FROM person WHERE id=?'
    var param = id
    connection.query(sql,param, function(err, row, fields) {
      if(err){
        console.log(err);
      }else {
        var sql = 'SELECT displayName FROM member WHERE id=?'
        var param = row[0].campursID
        connection.query(sql,param, function(err, campursName, fields){
          res.render('mysql/topic/preview',{ topic:row[0], imagesUrl:imagesUrl, bgimgUrl:bgimgUrl, campursName:campursName[0]})
        })
      }
    })
  })

  route.get(['/','/:id'], function(req, res){
    var sql = 'SELECT id,name FROM person'
    //캠퍼스 등록생만 보기
    var param = []
    if(req.user && (req.user.username != '김성범')){
      var sql = 'SELECT id,name FROM person WHERE campursID=?'
      var param = [req.user.id]
    }
    connection.query(sql,param, function(err, rows, fields){
      if(err){
        console.log(err);
      }
      var id = req.params.id
      if(id){
        var sql = 'SELECT * FROM person WHERE id=?'
        var param = id
        connection.query(sql,param, function(err, row, fields) {
          if(err){
            console.log(err);
          }else {
            var sql = 'SELECT displayName FROM member WHERE id=?'
            var param = row[0].campursID
            connection.query(sql,param, function(err, campursName, fields){
              res.render('mysql/topic/view',{name:id,topic:row[0], topics:rows, user:req.user, imagesUrl:imagesUrl, bgimgUrl:bgimgUrl, campursName:campursName[0]})
            })
          }
        })
      }
      else{
        res.render('mysql/topic/view',{topics:rows, user:req.user})
      }
    })
  })
  return route
}
