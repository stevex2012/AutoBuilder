/**
 * Created by gone with wind on 2017/8/22.
 */
// 引入所需模块=================================
var fs = require('fs');// 文件某块
var image = require('images');//图片，获取片宽高，
var cheerio = require('cheerio');// 获取html字符串，操作dom cheerio.load()
// //编译版本，app还是pc============
// var edition = process.argv[2];
// console.log('开始生成'+edition+'专题页...');
// // 所有数据的集合，变量
// var imgUrl=[];
// // title,discription,kewword;
// var headHTMLAttr={};
// /// 执行所有方法，get page==================================
// imgUrl=getImgAtr('img/'+edition);
// // 得到配置 json ，吧 imgUrl 和json组合起来
// combinationData(getConfigureJson,'json/'+edition+'.json');
// // 生成 css，文件
// createScss('../target/'+edition+'/css/index.css',buildScssData);
// //创建 img文件夹=====
// createAdir('../target/'+edition+'/img');
// // 复制图片====
// copyImg('img/'+edition, '../target/'+edition+'/img');
// ///读取 html文件========================
// var contHTML = fs.readFileSync('htmltemplate/'+edition+'.html');
// $ = cheerio.load(contHTML);//
// // 操作html，模板===================，填充内容
// initHTML(imgUrl,edition);
// //生成 目标，html
// createHTML('../target/'+edition+'/index.html');

/// 生成一个函数，暴露出去==============================
// {
//     pageType:'pc'||'app',
//     configData:{}//配置文件数据  
// }
// 所有数据的集合，变量
var imgUrl = [];
// title,discription,kewword;
var headHTMLAttr = {};

const SRC = './server/components/AutoBuild';
const DIST = './server/components/AutoBuild/public';

function buildHtml(opt) {
  console.log(opt, opt.configData);
  //编译版本，app还是pc============
  var edition = opt.pageType;

  console.log('开始生成' + edition + '专题页...');
  // 所有数据的集合，变量
  //var imgUrl=[];
  // title,discription,kewword;
  //var headHTMLAttr={};
  /// 执行所有方法，get page==================================
  imgUrl = getImgAtr(`${SRC}/img/${edition}`);

  // 得到配置 json ，吧 imgUrl 和json组合起来  //'autoBuild/src/json/'
  combinationData(getConfigureJson, opt.configData || `${SRC}/json/${edition}.json`);
  // 生成 css，文件
  createScss(`${DIST}/${edition}/css/index.css`, buildScssData);
  //创建 img文件夹=====
  createAdir(`${DIST}/${edition}/img`);
  // 复制图片====
  copyImg(`${SRC}/img/${edition}`, `${DIST}/${edition}/img`);

  ///读取 html文件========================
  var contHTML = fs.readFileSync(`${SRC}/tpl/${edition}.html`);

  $ = cheerio.load(contHTML);
  // 操作html，模板===================，填充内容

  initHTML(imgUrl, edition);
  //生成 目标，html
  createHTML(`${DIST}/${edition}/index.html`);
  // 执行回调，返回生成 文件夹的路径============
  const tragetPath = `${DIST}/${edition}`;
  typeof opt.callback === 'function' && opt.callback(tragetPath);
}

/*
* 1,获取 node 命令，生成app，还是pc，process
*
*
* */
///// 读取图片
// 生成 html 的函数
// 组合配置，数据==========================
// 拼接 html字符串 函数
// 获取，img文件下面图片，函数 获取引用地址，
// 获取，图片w，h 函数 图片路径，
// 获取 跳转地址 json
// 获取图片属性======================================
/*
 * [ { width: 900, height: 535, url: 'img/img_01.jpg' },
 { width: 900, height: 402, url: 'img/img_02.jpg' },
 { width: 900, height: 313, url: 'img/img_03.jpg' },
 { width: 900, height: 419, url: 'img/img_04.jpg' } ]
 *
 *
 * */
// 读取图片宽，高，url=================================
function getImgAtr(path) {
  console.log('开始读取图片属性...');
  // fs 模块 读取img 文件下面所有的图片，
  var files = fs.readdirSync(path);// 文件读取顺序 、？？？
  var imgUrl = [];
  files.forEach(function (item, index) {
    var width = image(path + '/' + item).width(),
      height = image(path + '/' + item).height(),
      imgAttr = {
        width: width,
        height: height,
        imgUrl: 'img/' + item + '?ver=' + new Date().getTime()
      };
    imgUrl.push(imgAttr);
  })
  return imgUrl;
}
////  获取点击区域 配置json 生成 scss====
function getConfigureJson(path) {
  console.log('读取配置json文件...');
  // var file = fs.readFileSync(path, 'utf-8'),
  //     configData=JSON.parse(file);

  // headHTMLAttr={
  //     title:configData.title,
  //     description:configData.description,
  //     keyword:configData.keyword
  // };
  var configData = '';
  // 判断传入的是 ，路径，还是 数据（对象）
  if (typeof path == 'object') {
    configData = path || '';

  } else {
    var file = fs.readFileSync(path, 'utf-8'),
      configData = JSON.parse(file);
  }
  headHTMLAttr = {
    title: configData.title || '买车用车上长安商城',
    description: configData.description || 　'买车用车上长安商城',
    keyword: configData.keyword || '买车用车上长安商城'
  };
  return configData.data;
}
///// 组合配置，数据=====================================
function combinationData(getConfigJson, path) {
  console.log('组合配置json文件，和图片信息');
  var clickZone = getConfigJson(path);
  //console.log(clickZone);
  clickZone.length && 　clickZone.forEach(function (item) {// 给需要，添加点击区域的添加点击的url
    //console.log(item.data,item.index);
    var i = Number(item.index) - 1;
    imgUrl[i].data = item.data;
  });
  console.log(imgUrl);
}
// // 根据数组，组合返回样式===============================
function getEachCss(obj) {
  //var width =edition=='pc' ? '1180':obj.width,
  var width = obj.width,
    height = obj.height,
    arr = [];
  obj.data.forEach(function (item) {
    var cssObj = {
      left: item.left || (item.x / width * 100).toFixed(2) + '%',
      top: item.top || (item.y / height * 100).toFixed(2) + '%',
      width: item.width.indexOf('%') != -1 && item.width || (item.width / width * 100).toFixed(2) + '%',
      height: item.height.indexOf('%') != -1 && item.height || (item.height / height * 100).toFixed(2) + '%'
    }
    arr.push(cssObj);
  });
  return arr;
}
// 生成 scss 文件======================================
function buildScssData() {
  // 根据json 数据，生成scss /btn 没有分组
  var scss = [];
  imgUrl.forEach(function (item) {
    var tem = item.data && getEachCss(item);
    if (tem) {
      scss = scss.concat(tem);
    }
  });
  return scss;
}
/// // 根据scss 数据，拼接 字符串=================
function createScss(dst, fn) {
  console.log('生成目标css文件...');
  var scssString = '';
  var scssArr = fn();
  scssArr.forEach(function (item, index) {
    var temStr = JSON.stringify(item);
    scssString += '.btn' + (index + 1) + '' + temStr
  });
  // 正则替换 "",and  , 符号===============
  fs.writeFileSync(dst, scssString.replace(/\"/ig, '').replace(/\,/ig, ';'))
}
// //创建 文件 夹==============================
function createAdir(path) {
  // 文件夹    ========是否存在
  var ist = fs.existsSync(path);
  if (ist) {// 存在 下面是否有文件，有文件，删除，
    var files = fs.readdirSync(path);
    files.length && files.forEach(function (item) {
      var curentPath = path + '/' + item;
      delFiles(curentPath);
    })
  } else {
    fs.mkdirSync(path, function (err) {
      if (err) {
        console.log('failed to create a dir');
      }
    })
  }
  //
}
// 复制 图片====================================
function copyImg(src, dst) {
  console.log('开始复制图片到目标目录...');
  var files = fs.readdirSync(src);
  files.forEach(function (item) {
    var dstPath = dst + '/' + item;//文件筛选
    //fs.writeFileSync(dstPath)
    image(src + '/' + item).save(dstPath);
  })
}
// 删除文件夹 下面的所有文件========================
function delFiles(path) {
  if (fs.statSync(path).isDirectory()) {//文件夹

  } else {
    fs.unlinkSync(path)
  }
}
// 操作html 模板，===================================
function initHTML(data, isPc) {
  console.log('操作模板html，填充数据...')
  var html = '',
    totalHeight = 0;

  data.forEach(function (item, index) {// 如果是app，则根据iframe 来
    var ahtml = '';
    totalHeight += Number(item.height);
    item.data && item.data.forEach(function (list) {
      var clkElemt = '';
      if (isPc == 'pc') {
        clkElemt = '<a href="' + list.url + '" target="_blank" class="btn"></a>'
      } else if (isPc == 'app') {
        clkElemt = '<div class="clickable btn" data-type="' + list.dataType + '" data-url="' + list.url + '" data-title="' + list.dataTitle + '"></div>'
      }
      ahtml += clkElemt;
    });
    html += '<div class="img-box"><img src="' + item.imgUrl + '" alt="">' + ahtml + '</div>'
  });

  $('.content').html(html);
  
  var allClkA = $('.img-box .btn');
  var arr = Array.prototype.slice.apply(allClkA)
  arr.forEach(function (item, index) {
    $(item).addClass('btn' + (index + 1));
  });

  //设置总高度
  isPc == 'pc' ? $('.box').css('height', totalHeight + 'px') : '';
  // 设置，head title 和meta属性
  $('title').text(headHTMLAttr.title);
  $("meta[name='description']").attr('content', headHTMLAttr.description);
  $("meta[name='keyword']").attr('content', headHTMLAttr.keyword)
  //给样式文件增加版本号====================
  var cssDom = $("link");
  var linkDomArr = Array.prototype.slice.call(cssDom);
  console.log('修改样式文件版本号');
  (function () {
    for (var i = 0; i < linkDomArr.length; i++) {
      var oldVer = $(linkDomArr[i]).attr('href');
      var newVer = oldVer + '?ver=' + new Date().getTime();
      $(linkDomArr[i]).attr('href', newVer)
    }
  })();
}
// 生成 目标html 文件===================
function createHTML(path) {
  console.log('生成目标html...');
  fs.writeFileSync(path, $.html(), function (err, data) {
    if (err) {
      console.log('failed to write a file');
      throw err;
    }
  });
  console.log('生成专题页完成...请在' + path + '目录下面查看');
}
module.exports = {
  buildHtml: buildHtml
}
