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
        this.endWithText = this.endWithText.bind(this);
        this.writeHead = this.writeHead.bind(this);
        this.filter = this.filter.bind(this);
        this.dumpBody = this.dumpBody.bind(this);
        this.start = this.start.bind(this);
    }

    setRouter(router) {
        this.router = router
    }


    endWithText(res, content, statusCode = 200, customHeaders = {}) {
        res.writeHead(statusCode, Object.assign({}, commonHeaders, customHeaders));
        console.log(content);
        res.end(content)
    };
    writeHead(res, statusCode = 200) {
        res.writeHead(statusCode, Object.assign({}, commonHeaders));
    };

    async filter(req, res) {
        /**
         * 封装上下文
         */
        const context = {
            config: this.config,
            req: req,
            res: res,
            endWithText: this.endWithText,
            writeHead: this.writeHead
        };
        if (this.router) {
            for (let i = 0; i < this.router.length; i++) {
                let temp = this.router[i];
                if (temp && await temp.handle(context)) {
                    return true;
                }
            }
        }
        return fallbackRouter.handle(context);

    }


    dumpBody(req)  {
        let body = [];
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            console.log("data".bgYellow + "=[" + body.grey + "]");
        });
    }

    start() {
        http.createServer(async (req, res) => {
            const {method, url} = req;
            console.log(method.green, url);

            if (method === "OPTIONS") {
                this.writeHead(res, 200);
                res.end();
                return;
            }

            if (method === "POST" && this.config.dumpPost) {
                this.dumpBody(req);
            }

            if (!await this.filter(req, res)) {
                this.endWithText(res, '{"success": false,"errMsg": "page not found"}', 404)
            }

        }).listen(this.config.PORT, this.config.HOST);
        console.log(`listening at ${this.config.HOST}:${this.config.PORT}`)


    }
}

module.exports = SlimServer;



