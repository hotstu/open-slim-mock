//=====================
//演示使用本地内存缓存代理服务数据
//=====================

const Handler = require("../src/handler");
const proxy = require("../src/processor/proxyProcessor");


const sampleApp = new Handler(/([\s|\S]*)/);
const myProxy = proxy({
    dstHost: "http://httpbin.org"
});
const MemoryCache = () => {
    let cache = {};
    return {
        save: (key, buffer) => {
            cache[key] = buffer;
        },
        find: (key) => {
            return cache[key];
        },

        contains: (key) => {
            return cache.hasOwnProperty(key);
        },
        remove: (key) => {
            delete cache[key];
        },
        clear: () => {
            cache = {}
        },
        dump: () => {
            //TODO save to file
            console.log("saving...");
        }
    }
};

const myCache = MemoryCache();

const queryRecorder = (next) => async (match, context) => {
    const {req, res, endWithBuffer} = context;
    const {url} = req;
    if (myCache.contains(url)) {
        console.log("!!!hit cache use cached data instead of fetching remote!!!!");
        const {code, headers, body} = myCache.find(url)||{};
        endWithBuffer(body, code, headers);
        return true;
    }
    let buffer = [];
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
            console.log(url.bgYellow + "=[" + body.toString().grey + "]");
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