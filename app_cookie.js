var express = require('express')
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser('198hfq13kjjqhe'))

var products = {
  1:{title:'The history of web 1'},
  2:{title:'The next web'}
}

app.get('/products', function(req, res){
  output=''
  for(var name in products){
    output += `
    <li>
      ${products[name].title} <a href="/cart/${name}">add</a>
    </li>`;
  }
  res.send(`
    <h1>Products</h1>
    <ul>${output}</ul>
    <a href="/cart">cart</a>
    `)
})

app.get('/cart/add/:id', function(req, res){
  var id = req.params.id
  var cart = req.signedCookies.cart
  cart[id] = parseInt(cart[id])+1
  res.cookie('cart', cart, {signed:true})
  res.redirect('/cart')
})

app.get('/cart/sub/:id', function(req, res){
  var id = req.params.id
  var cart = req.signedCookies.cart
  cart[id] = parseInt(cart[id])-1
  if(cart[id]===0){
    delete cart[id]
  }
  res.cookie('cart', cart, {signed:true})
  res.redirect('/cart')
})

app.get('/cart/delete/:id', function(req, res){
  var id = req.params.id
  var cart = req.signedCookies.cart
  if(cart){
    delete cart[id]
  }
  res.cookie('cart', cart, {signed:true})
  res.redirect('/cart')
})

app.get('/cart/:id', function(req, res){
  var id = req.params.id

  if(req.signedCookies.cart){
    var cart = req.signedCookies.cart
  }else{
    var cart = {}
  }
  if(!cart[id]){
    cart[id] = 0
  }
  cart[id] = parseInt(cart[id])+1
  res.cookie('cart', cart, {signed:true})
  res.redirect('/cart')
})

app.get('/cart', function(req, res){
  var cart = req.signedCookies.cart
  var output=''
  if(!cart || (Object.keys(cart).length == 0) ){
    output = `<li>Empty</li>`
  }else{

    for(id in cart){
      output += `
      <li>
      ${products[id].title} [${cart[id]}]
      <a href="cart/sub/${id}">(-)</a>
      <a href="cart/add/${id}">(+)</a>
      <a href="cart/delete/${id}">(x)</a></li>`
    }
  }
  res.send(`<h1>Cart</h1><ul>${output}</ul><a href="products">Products list</a>`)
})

app.get('/count',function(req, res){
  if(req.signedCookies.count){
    var count = parseInt(req.signedCookies.count)
  }else {
    var count = 0
  }
  count = count + 1
  res.cookie('count',count, {signed:true})
  res.cookie('page', 72, {sigend:true})
  res.send('count: '+req.signedCookies.count)
})

app.listen(3000, function(){
  console.log('connected 3000 port!!!')
})
