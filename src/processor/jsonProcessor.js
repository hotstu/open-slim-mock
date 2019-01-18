const stringProcessor = require("./stringProcessor");

/**
 * 将json自动转换为string再输出
 * @param json
 * @returns {function(*, {res?: *, endWithText: *}): *}
 */
const jsonProcessor = (json) => stringProcessor(JSON.stringify(json));

module.exports = jsonProcessor;