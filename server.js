var http = require('http');
var url = require('url');

function start(route, handle) {
  // 使用具名函数
  function onRequest(request, response) {
    var postData = '';
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    route(handle, pathname, response, request);

    /**
     * writeHead：写http请求头
     * write：写入浏览器页面的内容
     * end：完成响应
     */
    // response.writeHead(200, {"Content-Type": "text/plain"});
    // response.write("Hello World");
    // response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started");
}

exports.start = start;