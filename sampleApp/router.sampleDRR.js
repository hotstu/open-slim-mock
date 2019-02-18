//=====================
//演示使用本地内存缓存代理服务数据
//=====================
const path = require("path");

const Handler = require("../src/handler");
const proxy = require("../src/processor/proxyProcessor");
const {DiskCache} = require("../src/util/cache");
const sampleApp = new Handler(/([\s|\S]*)/);
const myProxy = proxy({
    dstHost: "http://httpbin.org",
    dumpResponse:true
});



//const myCache = MemoryCache();
const myCache = DiskCache(path.resolve(__dirname, 'dump'));

const queryRecorder = (next) => async (match, context) => {
    const {req, res, endWithBuffer} = context;
    const {url} = req;
    if ("/dump" === url) {
        myCache.snapshot();
        endWithBuffer("dump", 200);
        return true;
    }
    if (myCache.contains(url)) {
        console.log("!!!hit cache use cached data instead of fetching remote!!!!");
        const {code, headers, body} = myCache.find(url)||{};
        endWithBuffer(body, code, headers);
        return true;
    }
    const buffer = [];
    res.on("pipe", (src) => {
        src.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            buffer.push(chunk);
        }).on('end', () => {
            let body = Buffer.concat(buffer);
            myCache.save(url, {
                code:res.statusCode,
                headers:res.getHeaders(),
                body
            });
            //console.log(body);
        });
    });

    return await next(match, context)
};

/**
 * Dump/Record/Reproduce
 * 记录每一个接口和与之对应的返回结果到本地，用于重放
 */
sampleApp.registerHandler(/([\s|\S]*)/, queryRecorder(myProxy));

module.exports = sampleApp;