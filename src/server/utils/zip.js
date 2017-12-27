// com/zip.js
// 传入 文件路劲。或则文件路径，压缩
var fs = require('fs');
var jszip = require('jszip');
var zipper = require("zip-local");

function dozip(path, filename) {
  console.log('你 引入 了 dozip 模块');
  console.log('你传入的压缩路径：' + path);
  zipper.sync.zip(path).compress().save(`${filename}.zip`);
  console.log('压缩文件的保存路径：' + filename);
}
// 返回，暴露
module.exports = {
  dozip: dozip
}