const static = require('node-static');
const url = require("url");

/**
 * 处理静态文件目录
 * @param root
 * @returns {function(*=, {req?: *, res?: *, endWithText?: *}): Promise<*>}
 */
const staticHandler = (root) => {
    const staticHost = new static.Server(root);
    console.log("binary--> " + root);
    return async (match, {req, res, endWithText}) => {
        return new Promise((resolve) => {
            if (match && match[1]) {
                req.url = match[1];
                console.log("binary-->" + decodeURI(url.parse(req.url).pathname));
                staticHost.serve(req, res, (err, data) => {
                    if (err) {
                        console.error(err);
                        endWithText(res, '{"status":"error","msg": "file not found"}', 404);
                        res.end();
                        resolve(false);
                    }
                    resolve(true);
                });
            } else {
                endWithText(res, '{"status":"error","msg": "file not found"}', 404);
                resolve(false);

            }
        })
    }
};

module.exports = staticHandler;