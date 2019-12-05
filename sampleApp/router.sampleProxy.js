const Handler = require("../src/handler");
const proxy = require("../src/processor/proxyProcessor");


const sampleApp = new Handler(/([\s|\S]*)/);
//测试文件做数据源输出 访问http://127.0.0.1:8082/get?a=1
sampleApp.registerHandler(/([\s|\S]*)/, proxy({
    dstHost:"http://192.168.31.160:9999",
    injectRespHeader: {
        'set-Cookie':'JSESSIONID=5A203E8903D39FBA98F3DB1BE62B9E59'
    }
}));

module.exports = sampleApp;
