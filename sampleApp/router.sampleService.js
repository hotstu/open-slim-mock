//=====================
//演示作为web服务器处理（前后端分离，前端渲染）

//=====================
const path = require("path");
const qs = require('querystring');

const Handler = require("../src/handler");
const {DiskCache} = require("../src/util/cache");
const sampleApp = new Handler(/([\s|\S]*)/);
const binaryFileProcessor = require("../src/processor/staticFileProcessor");
const jsonProcessor = require("../src/processor/jsonProcessor");

//const myCache = MemoryCache();
const myCache = DiskCache(path.resolve(__dirname, 'dump'));
const snap = myCache.snapshot();
const keys = Object.keys(snap);

sampleApp.registerHandler(/\/service\/list/, jsonProcessor(keys));
sampleApp.registerHandler(/\/service\/view([\s|\S]*)/, binaryFileProcessor('sampleApp/static/tpl_detail.html'));
sampleApp.registerHandler(/\/service\/detail\/?([\s|\S]*)/, (match, {req, endWithBuffer}) => {
    const {method} = req;
    const key = decodeURIComponent(match[1]);
    let code;
    if (method === "POST") {
        try {
            const {code:oldCode} = myCache.find(key);
            code = oldCode
        } catch (e) {
            return endWithBuffer(e.toString());
        }

        // 保存 这里只处理urlencode 方式的post body
        return new Promise((resolve, reject) => {
            let poastData = [];
            req.on('data', (chunk) => {
                poastData.push(chunk);
            }).on('end', () => {
                    poastData = Buffer.concat(poastData).toString();
                    const parsed = qs.parse(poastData);
                    resolve({code, ...parsed});
            }).on("error", (e) => {
                reject(e);
            });
        }).then(({code, headers, body}) => {
            return myCache.save(key, {code, headers: JSON.parse(headers), body: Buffer.from(body)})
        }).then(()=> {
            return myCache.snapshot()
        }).then(() => {
            return endWithBuffer("done");
        }).catch((e) => {
            return endWithBuffer(e.toString());
        })


    } else {
        try {
            let {code, headers, body} = myCache.find(key);
            return endWithBuffer(JSON.stringify({
                //TODO 处理非字符数据
                code, headers, body: body.toString()
            }))
        } catch (e) {
            return endWithBuffer(e.toString())
        }

    }

});
sampleApp.registerHandler(/\/service/, binaryFileProcessor('sampleApp/static/tpl_list.html'));


module.exports = sampleApp;