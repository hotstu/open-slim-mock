/**
 * 直接输出字符串
 * @param text
 * @returns {function(*, {res?: *, endWithText: *}): *}
 * @constructor
 */
const Processor = (text) => async (match, {res, endWithText}) => {
    return await endWithText(res, text);
}


module.exports = Processor;