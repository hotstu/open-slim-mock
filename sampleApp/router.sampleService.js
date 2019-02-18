//=====================
//演示作为web服务器处理（前后端分离，前端渲染）
//=====================
const path = require("path");

const Handler = require("../src/handler");
const {DiskCache} = require("../src/util/cache");
const sampleApp = new Handler(/([\s|\S]*)/);
const binaryFileProcessor = require("../src/processor/staticFileProcessor");
const jsonProcessor = require("../src/processor/jsonProcessor");


//const myCache = MemoryCache();
const myCache = DiskCache(path.resolve(__dirname, 'dump'));
const snap = myCache.snapshot();
const keys = Object.keys(snap);

sampleApp.registerHandler(/\/service\/list/,jsonProcessor(keys));
sampleApp.registerHandler(/\/service\/view([\s|\S]*)/,binaryFileProcessor('sampleApp/static/tpl_detail.html'));
sampleApp.registerHandler(/\/service\/detail\/([\s|\S]*)/,(match, {req, endWithBuffer}) => {
    const {method} = req;
    if(method === "POST") {
        //TODO 保存

    } else {
        let {code, headers, body} = myCache.find(decodeURIComponent(match[1]));
        return endWithBuffer(JSON.stringify({
            code,headers, body:body.toString()
        }))
    }

});
sampleApp.registerHandler(/\/service/,binaryFileProcessor('sampleApp/static/tpl_list.html'));


module.exports = sampleApp;