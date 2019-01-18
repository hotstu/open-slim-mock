const static = require('node-static');
const staticHost = new static.Server();

/**
 * 处理单个静态文件
 * @param localPath 主要这个路径是相对于项目根目录（index.js）的
 * @returns {function(*, {req?: *, res?: *, endWithText?: *}): Promise<*>}
 */
const staticHandler = (localPath) => {
    return async (match, {req, res, endWithText}) => {
        return new Promise((resolve) => {
            let eventEmitter = staticHost.serveFile(localPath, 200, {}, req, res);
            eventEmitter.addListener("success", () => {
                resolve(true);
            });
            eventEmitter.addListener("error", (e) => {
                console.error(e);
                endWithText(res, '{"status":"error","msg": "file not found"}', 404);
                resolve(false);
            })
        })
            ;
    }
};

module.exports = staticHandler;