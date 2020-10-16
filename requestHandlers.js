var exec = require('child_process').exec;
var querystring = require('querystring');
var fs = require('fs');
var formidable = require('formidable');

/**
 * 分别在两个网页输入http://localhost:8888/start和http://localhost:8888/upload
 * 先访问/start再访问/upload
 * /upload不会因为/start的延迟而延迟响应，/upload立即响应，/start延迟10s再响应
 */

/**
 * /start中输入内容后，点击sumbit按钮会将内容post到服务端
 * 因为这个form在提交之后会请求/upload，upload就会将之前
 * post的数据展示在/upload页面中
 */
function start(response) {
  console.log('Request handler `start` was called.');

  var body = '<html>' +
    '<head>' +
    '<meta http-equiv="Content-Type" content="text/html; ' +
    'charset=UTF-8" />' +
    '</head>' +
    '<body>' +
    '<form action="/upload" enctype="multipart/form-data" method="post">' +
    '<input type="file" name="upload" multiple="multiple">' +
    '<input type="submit" value="Upload file" />' +
    '</form>' +
    '</body>' +
    '</html>';

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(body);
  response.end();

  // 回调函数非阻塞
  // exec("find /",
  //   { timeout: 10000, maxBuffer: 20000 * 1024 },
  //   function (error, stdout, stderr) {
  //     response.writeHead(200, { "Content-Type": "text/plain" });
  //     response.write(stdout);
  //     response.end();
  //   });
}

function upload(response, request) {
  console.log(`Request handler 'upload' was called.'`);

  var form = new formidable.IncomingForm();
  console.log('about to parse');
  form.parse(request, function (error, fields, files) {
    console.log('parsing done');
    fs.renameSync(files.upload.path, './tmp/test.png');
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('received img:<br/>');
    response.write(`<img src='/show' />`);
    response.end();
  });
}

/**
 * 因为<img src='/show' />中请求了/show
 * 所以会响应./tmp/test.png图片
 */
function show(response) {
  console.log(`Request handler 'show' was called.`);
  fs.readFile('./tmp/test.png', 'binary', function (error, file) {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.write(error + '\n');
      response.end();
    } else {
      response.writeHead(200, { 'Content-Type': 'image/png' });
      response.write(file, 'binary');
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;