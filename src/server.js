const http = require('http');
require("colors");
const commonHeaders = {
    'Powered-By': 'openSlimMock@hglf',
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "POST, GET,PUT, DELETE, OPTIONS, HEAD'",
    "Access-Control-Max-Age": "3600",
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
};

const fallbackRouter = require("./router/router.fallback");

class SlimServer {
    constructor(config = {}) {
        this.config = Object.assign({
            "PORT": 8082,
            "HOST": `0.0.0.0`,
            "dumpPost": true,
        }, config);
        this.endWithBuffer = this.endWithBuffer.bind(this);
        this.writeHead = this.writeHead.bind(this);
        this.filter = this.filter.bind(this);
        this.dumpStream = this.dumpStream.bind(this);
        this.start = this.start.bind(this);
        this.injectHeader = this.injectHeader.bind(this);
    }

    setRouter(router) {
        this.router = router
    }


    endWithBuffer(res) {
        return (content, statusCode = 200, customHeaders = {}) => {
            res.writeHead(statusCode, this.injectHeader({}, customHeaders));
            //console.log(content);
            res.end(content)
        }

    };

    writeHead(res) {
        return (statusCode = 200, customHeaders = {}) => {
            res.writeHead(statusCode, this.injectHeader({}, customHeaders));
        }
    };

    injectHeader(origin, customHeaders = {}) {
        return Object.assign(origin, commonHeaders, customHeaders);
    }

    async filter(req, res) {
        /**
         * 封装上下文
         */
        const context = {
            config: this.config,
            req: req,
            res: res,
            endWithText: this.endWithBuffer(res),
            endWithBuffer: this.endWithBuffer(res),
            writeHead: this.writeHead(res),
            dumpStream: this.dumpStream,
            injectHeader: this.injectHeader
        };
        if (this.router) {
            for (let i = 0; i < this.router.length; i++) {
                let temp = this.router[i];
                if (temp && await temp.handle(context)) {
                    return true;
                }
            }
        }
        return await fallbackRouter.handle(context);

    }


    dumpStream(stream, headers) {
        const contentType = headers['content-type'];
        const contentEncoding = headers['content-encoding'];
        const customPolicy = headers['x-proxy-policy'];
        if (contentType &&
            (contentType.indexOf("text") !== -1 || contentType.indexOf("json") !== -1) &&
            customPolicy.indexOf("bypassDump") === -1) {
            let body = [];
            stream.on('error', (err) => {
                console.error(err);
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                //TODO gzipの場合
                if (contentEncoding && contentEncoding === 'gzip') {

                }
                body = Buffer.concat(body).toString();
                console.log("data".bgYellow + "=[" + body.grey + "]");
            });
        } else {
            console.log("data--> ".bgYellow + "[binary data]");
        }

    }

    start() {
        http.createServer(async (req, res) => {
            const {method, url} = req;
            const start = new Date().getTime();
            console.log(method.green, `${url} start`);
            res.on("close", () => {
                console.log('close');
            });
            res.on('finish', function () {
                const cost = new Date().getTime() - start;
                console.log(method.green, `${url} finish in ${cost} ms`);
            });
            if (method === "OPTIONS") {
                this.writeHead(res, 200);
                res.end();
                return;
            }

            if (!await this.filter(req, res)) {
                this.endWithText(res, '{"success": false,"errMsg": "content not found"}', 404)
            }

        }).listen(this.config.PORT, this.config.HOST);
        console.log(`open-slim-mock server listening at ${this.config.HOST}:${this.config.PORT}, only use in test purpose`)


    }
}

module.exports = SlimServer;



