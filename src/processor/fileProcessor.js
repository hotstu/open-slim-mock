const {readFile} = require("fs");

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
    console.log("read " + data);
    endWithText(res, data, 200, {'Content-Type': type});
};

module.exports = Processor;