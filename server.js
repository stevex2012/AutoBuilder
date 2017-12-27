// server.js
// 创建一个服务器
var express = require('express');
var fs = require('fs');
var utils = require('./server/utils/utils.js');
// 解析 post 请求 参数
var bodyParser = require('body-parser');
// 引入 压缩插件v
var dozip = require('./server/utils/zip.js');
// zip.js test code
//dozip.dozip('autobuild/target/app');
var base64 = require('./server/utils/base64.js');
// 引入 生成 html 脚本 js
var build = require('./server/components/AutoBuild/index.js');


//引入配置文件
var config = require('./config');
console.log('当前运行环境为：'+config.env);

var hostName = 'localhost';
// 将端口号设置为配置文件的端口号，默认值为3000
var port = utils.normalizePort(config.port || '3000');
// 打印输出端口号
//console.log('当前监听端口号为： ' + port);

var root = 'build';
var downDIST = `./build`;
var autoBuildBasePath = './server/components/AutoBuild';

var app = express();

//limit:'10000kb'  设置 服务器 接受的 数据 大小限制
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '10000kb'
}));

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', (req, res) => {
  var pathname = `${root}/index.html`;
  fs.readFile(pathname, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end('<h1>404 Not Found</h1>');
      console.log(err);
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

app.get('/*.js', (req, res) => {
  const path = req.path;
  console.log(path);
  fs.readFile(`${root}${path}`, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/javascript" })
      //res.end('<h1>404 Not Found</h1>')
      console.log(err);
    }
    res.writeHead(200, { "Content-Type": "text/javascript" })
    res.end(data);
  })
});

app.get('/*.css', (req, res) => {
  const path = req.path;
  console.log(path);
  fs.readFile(`${root}${path}`, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/css" })
      //res.end('<h1>404 Not Found</h1>')
      console.log(err);
    }
    res.writeHead(200, { "Content-Type": "text/css" })
    res.end(data);
  })
});

app.get('/get', (req, res) => {
  console.log(`请求 url:${req.path}`);
  console.log(`请求参数:${req.query}`);
  res.send('这是get');
});

app.post("/post", function (req, res) {
  console.log("请求参数：", req.body);
  var result = { code: 200, msg: "post请求成功" };
  res.send(result);
});

// 前台传过来的 数据，这里调用脚本，利用数据 生成 html
app.post('/getjson', (req, res) => {
  //console.log("请求参数：",req.body)
  var data = JSON.parse(req.body.data)
  //     var result = {
  //        result:0,
  //        data:data
  //    }
  // 1-->pc,; 2-->app
  const isPc = Number(req.body.isPc) === 1;
  const writePath = `${autoBuildBasePath}/img`;

  //    res.send({
  //        result:0
  //    })
  ///
  base64.base642Img(data, isPc, writePath);
  //res.send(result)
  const configData = {
    data: data,
    title: req.body.title || '',
    description: req.body.description || '',
    keyword: req.body.keyword || ''
  }
  const pageType = isPc ? 'pc' : 'app';
  const options = {
    pageType: pageType,
    configData: configData,
    callback: function (path) {
      console.log(`返回生成目标文件夹路径 :${path}`)
      const zipOutFile = `${downDIST}/${pageType}`;
      dozip.dozip(path, zipOutFile);
      res.send({
        result: 0,
        data: {
          downloadUrl: `${pageType}.zip`//'./app.zip'
        }
      });
      // res.download(`./${zipFileName}.zip`,(err)=>{
      //     if(err){
      //         console.log('下载文件失败');
      //     }else{
      //         console.log('下载文件成功');
      //     }
      // })
    }
  }
  // 调用模块，生成 文件
  build.buildHtml(options);
});

// 编写 下载接口 
app.get('/app.zip', (req, res) => {
  // fs.readFileSync('./app.zip',(err,data)=>{
  //     res.send(data)
  // })
  // res.set({
  //     "Content-type":"application/octet-stream",
  //     "Content-Disposition":"attachment;filename="+encodeURI('./app.zip')
  // });
  // var fReadStream = fs.createReadStream('./app.zip');
  // fReadStream.on("data",function(chunk){res.write(chunk,"binary")});
  // fReadStream.on("end",function () {
  //     res.end();
  // });
  res.download(`${downDIST}/app.zip`, function (err) {
    if (err) {
      console.log('下载app.zip文件失败');
    } else {
      console.log('下载app.zip文件成功');
    }
  })
});

app.get('/pc.zip', (req, res) => {  
  res.download(`${downDIST}/pc.zip`, function (err) {
    if (err) {
      console.log('下载pc.zip文件失败');
    } else {
      console.log('下载pc.zip文件成功');
    }
  })
});

// 设置 服务器端口号:port
// 主机名 ：hostName
app.listen(port, hostName, () => {
  console.log(`server is running http://${hostName}:${port}`);
});

