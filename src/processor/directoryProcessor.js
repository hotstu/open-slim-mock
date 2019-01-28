const path = require("path");
const FileProcessor = require("./fileProcessor");

/**
 * 用于将目录下的文件内容输出
 * @param dir
 * @returns {function(*=)}
 * @constructor
 */
const Processor  = (dir) =>  (file) => {
    const fullPath = path.resolve(dir, file);
    return FileProcessor(fullPath);
};

module.exports = Processor;