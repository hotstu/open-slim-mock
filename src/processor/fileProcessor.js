const {readFile} = require("fs");

/**
 * 拷贝文件类容作为文本输出，会更加文件格式为json还是html自动设置媒体类型到响应头
 * 注意，如同是图片等二进制今天文件请用staticProcessor
 * @param path
 * @returns {function(*, {req: *, res?: *, endWithText?: *}): void}
 * @constructor
 */
const Processor = (path) => async (match, {req, res, endWithText}) => {
    return await load(path, res, endWithText);
}

/**
 *
 * @param {String} path 文档地址
 * @param {Response} response
 */
const load = async (path, res, endWithText) => {
    let type;
    if (path.endsWith('html')) {
        type = 'text/html; charset=utf-8';
    } else {
        type = 'application/json; charset=utf-8';
    }
    const data = await new Promise((resolve, reject)=> {
        readFile(path, 'utf8',(err, data)=> {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
    endWithText(res, data, 200, {'Content-Type': type});
};

module.exports = Processor;