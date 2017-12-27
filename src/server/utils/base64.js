var fs = require('fs');
// 将base64 ，转化为图片，写入目标文件类
// source:数据源  数组
// isPc:true -->pc端  false--->app端 
// path--->写入文件路径
function base642Img(source, isPc, path) {
  var type = isPc ? 'pc' : 'app';
  // 首先要判断 path 下面是不是 是不是 文件夹，如果是，先删除文件夹
  // 写入文件夹目录 ========= path
  const writeBasePath = `${path}/${type}`;
  //检查某个目录是否存在
  var stat = fs.statSync(writeBasePath);
  if (stat) {// 存在，删除文件夹 下面的 所有文件
    //fs.rmdirSync(writeBasePath);
    // 文件夹 下面有文件不能直接删除，..? 会 报错，decectory no empty
    const files = fs.readdirSync(writeBasePath);
    files.length && files.forEach(function (item) {
      var curentPath = writeBasePath + '/' + item;
      delFiles(curentPath);
    })
  } else {// 不存在 在创建一个===================
    fs.mkdirSync(writeBasePath, function (err) {
      if (err) {
        console.log(`failed to create a ${writeBasePath} dir`);
      }
    })
  }
  source.length && source.map((elm, idx) => {
    //去掉图片base64码前面部分data:image/png;base64
    const base64 = elm.base64Src.replace(/^data:image\/\w+;base64,/, "");
    // 把base64 转为 buffer 对象；
    var writePath = `${writeBasePath}/img_0${idx}.jpg`;
    var dataBuffer = new Buffer(base64, 'base64');
    console.log('dataBuffer是否是Buffer对象：' + Buffer.isBuffer(dataBuffer));
    fs.writeFileSync(writePath, dataBuffer, (err) => {
      if (err) {
        console.log('根据base64，写入图片失败');
        return;
      }
      console.log(`根据base64，写入图片成功,path:${path}/${type}/img_0${idx}.jpg`);
    })
  })
  // 图片写入成功后
}

// 删除文件夹 下面的所有文件========================
function delFiles(path) {
  if (fs.statSync(path).isDirectory()) {//文件夹

  } else {
    fs.unlinkSync(path)
  }
}

// 返回，暴露
module.exports = {
  base642Img: base642Img
}