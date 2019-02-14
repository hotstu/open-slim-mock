/**
 * 输出PostBody内容到console
 * @param next
 * @returns {function(*=)}
 * @constructor
 */
const Processor = (next) => async (match, context) => {
    const {config, dumpStream, req} = context;
    const {method, } = req;
    const {'x-proxy-policy': contentType} = req.headers;
    if (method === "POST" && config.dumpPost) {
        if (!contentType || contentType.indexOf("bypassDump") === -1) {
            //FIXME 这里执行dump操作可能会消耗掉stream里的内容而无法post到远端
            dumpStream(req);
        } else {
            console.log("[binary data]");
        }
    }
    //Decorator 
    return await next(match, context)
};

module.exports = Processor;