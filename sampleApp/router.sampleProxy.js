const Handler = require("../src/handler");
const proxy = require("../src/processor/proxyProcessor");


const sampleApp = new Handler(/([\s|\S]*)/);
//测试文件做数据源输出 访问http://127.0.0.1:8082/get?a=1
sampleApp.registerHandler(/([\s|\S]*)/, proxy({
    dstHost:"http://httpbin.org"
}));

module.exports = sampleApp;