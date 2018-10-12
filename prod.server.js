// var http= require ('http');
var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('/', function (req, res, next) {
  req.url = '/index.html';
  next();
});

//加载本地文件
var appData = require('./data.json');
//获取本地数据
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

router.get('/api/seller', (req, res) => {
  res.json({
    errors: 0,
    data: seller
  });
});
router.get('/api/goods', (req, res) => {
  res.json({
    errors: 0,
    data: goods
  });
});
router.get('/api/ratings', (req, res) => {
  res.json({
    errors: 0,
    data: ratings
  });
});
app.use('/',router);
app.use(express.static('./dist'));

/*
http.createServer(app).listen(port, function(){
  console.log("Express server listening on port " + port);
});
*/

module.exports = app.listen(port,function (err) {
  if(err){
    console.log(err);
    return;
  }
  console.log('服务器开启成功');
})




