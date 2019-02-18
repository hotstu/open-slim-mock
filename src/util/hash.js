const crypto = require('crypto');
const fs = require('fs');

function checksumFile(hashName, path) {
    return new Promise((resolve, reject) => {
        let hash = crypto.createHash(hashName);
        let stream = fs.createReadStream(path);
        stream.on('error', err => reject(err));
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}

function checksumBuffer(hashName, buffer) {
    return new Promise((resolve, reject) => {
        let hash = crypto.createHash(hashName);
        hash.update(buffer);
        resolve(hash.digest('hex'));
    });
}


// let buff = new Uint8Array([1]);
// checksumBuffer("md5", buff).then((sum) => {
//     console.log(sum);
// });
module.exports = {checksumFile, checksumBuffer};
