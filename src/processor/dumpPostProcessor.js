
/**
 * 输出PostBody内容到console
 * @param next
 * @returns {function(*=)}
 * @constructor
 */
const Processor  = (next ) =>  async (match, context) => {
    const {config, dumpStream, req} = context;
    const {method} = req;
    if (method === "POST" && config.dumpPost) {
        dumpStream(req);
    }
    return await next(match, context)
};

module.exports = Processor;