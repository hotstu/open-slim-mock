/**
 * 模拟网络延时
 * @param func
 * @param latency
 * @returns {Function}
 * @constructor
 */
const Processor = (func, latency) => async (match, context) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, typeof latency === "number"? latency: latency(match, context));
    });
    await func(match, context);
};

module.exports = Processor;