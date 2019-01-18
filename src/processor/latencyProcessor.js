/**
 * 模拟网络延时
 * @param func
 * @param latency
 * @returns {Function}
 * @constructor
 */
const Processor = (func, latency) => async (match, req, res) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, typeof latency === "number"? latency: latency(match, req, res));
    });
    await func(match, req, res);
};

module.exports = Processor;