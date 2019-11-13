/**
 * 输出PostBody内容到console
 * @param next
 * @returns {function(*=)}
 * @constructor
 */
const Processor = (next) => async (match, context) => {
    const {config, dumpStream, req} = context;
    const {method, } = req;
    if (method === "POST" && config.dumpPost) {
        //FIXME 这里执行dump操作可能会消耗掉stream里的内容而无法post到远端
        dumpStream(req, req.headers);
    }
    //Decorator
    return await next(match, context)
};

module.exports = Processor;
