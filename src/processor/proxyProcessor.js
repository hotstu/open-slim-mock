
/**
 * 对服务器进行反向代理，修改header实现跨域访问，便于在浏览器上调试
 * @author hgleifeng@foxmail.com
 * @since 2018.3.19
 */
const colors = require('colors');
const urlParser = require('url');
const mime = require('mime-types')
const dumpPost = true; //是否打印post内容
const dumpResponse = true; //是否打印response body
const injectRespHeader = true; //是否在响应头添加允许跨域字段
//const dstHost = "http://httpbin.org"; ///代理的host，需要修改
const dstHost = "http://127.0.0.1:8082"; ///代理的host，裴
const request = require('request')
const looseHeader = {
    "Author": "hgleifeng@foxmail.com",
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "POST, GET",
    "Access-Control-Max-Age": "3600",
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
}

console.log(process.argv)
const listenPort = process.argv[2]||8090;
const listenHost = process.argv[3]||dstHost;

const server = http.createServer(function (req, res) {
    const { method, url, headers } = req;
    console.log(method.green, url);
    if (method === "POST" && dumpPost) {
        dumpdata(req);
    }

    if(method === "GET"|| method === "POST") {
        const remote = request(listenHost + url)
        remote.on("response", (remoteResp) => {
            if(injectRespHeader) {
                Object.assign(remoteResp.headers, looseHeader);
            }
            const contentType = remoteResp.headers['content-type'];
            if( dumpResponse && contentType
                && (contentType.indexOf("text") != -1 || contentType.indexOf("json") != -1)) {
                dumpdata(remoteResp)
            } else {
                console.log("data--> ".bgYellow  + "[binary data]");
            }
        })
        req.on('error', handleErr)
        remote.on('error', handleErr)
        res.on('error', handleErr)

        req.pipe(remote).pipe(res);
    } else {
        //writeHead(res, 405)
        res.end('{"success": false,"errMsg": "not supported method"}');
    }
}).listen(listenPort);
console.log(`listen on ${listenPort}...\r\nremote=${listenHost}`)



function handleErr(err) {
    console.error(err)
}
