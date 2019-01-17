const stringProcessor = require("stringProcessor");

const jsonProcessor = (json) => stringProcessor(JSON.stringify(json));

module.exports = jsonProcessor;