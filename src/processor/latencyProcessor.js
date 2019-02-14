/**
 * 模拟网络延时
 * @param func
 * @param latency 可以是一个固定数值或者一个随机数生成函数
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