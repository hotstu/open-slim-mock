//=====================
//演示使用本地内存缓存代理服务数据
//=====================

const Handler = require("../src/handler");
const proxy = require("../src/processor/proxyProcessor");
const {checksumBuffer} = require("../src/util/hash");

const sampleApp = new Handler(/([\s|\S]*)/);
const myProxy = proxy({
    dstHost: "http://httpbin.org"
});
const path = require("path");

const fs = require("fs");
const {Serializer, Deserializer} = require("../src/util/buffer");
const mySerializer = Serializer();
const myDeserializer = Deserializer();

const MemoryCache = () => {
    let cache = {};
    return {
        save: (key, buffer) => {
            cache[key] = buffer;
        },
        find: (key) => {
            return cache[key];
        },

        contains: (key) => {
            return cache.hasOwnProperty(key);
        },
        remove: (key) => {
            delete cache[key];
        },
        clear: () => {
            cache = {}
        },
        snapshot: () => {
            return Object.assign({}, cache);
        }
    }
};

const DiskCache = (destination) => {
    let cache = {};
    //TODO init
    return {
        save: async (key, {code, headers, body}) => {
            const buff = mySerializer(code, headers, body);
            const sum = await checksumBuffer("md5", buff);
            let tempPath = path.resolve(destination, `${sum}.osm`);
            if (!fs.existsSync(tempPath)) {
                fs.writeFileSync(tempPath, buff);
            }
            console.log(sum);
            cache[key] = sum;
        },
        find: (key) => {
            const sum =  cache[key];
            const tempPath = path.resolve(destination, `${sum}.osm`);
            const buff = fs.readFileSync(tempPath);
            return myDeserializer(buff);
        },

        contains: (key) => {
            return cache.hasOwnProperty(key);
        },
        remove: (key) => {
            //TODO delete file
            delete cache[key];
        },
        clear: () => {
            cache = {}
        },
        snapshot: () => {

        }
    }
};

//const myCache = MemoryCache();
const myCache = DiskCache(path.resolve(__dirname, 'dump'));

const queryRecorder = (next) => async (match, context) => {
    const {req, res, endWithBuffer} = context;
    const {url} = req;
    if (myCache.contains(url)) {
        console.log("!!!hit cache use cached data instead of fetching remote!!!!");
        const {code, headers, body} = myCache.find(url)||{};
        endWithBuffer(body, code, headers);
        return true;
    }
    const buffer = [];
    res.on("pipe", (src) => {
        src.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            buffer.push(chunk);
        }).on('end', () => {
            let body = Buffer.concat(buffer);
            myCache.save(url, {
                code:res.statusCode,
                headers:res.getHeaders(),
                body
            });
            console.log(body);
        });
    });

    return await next(match, context)
};

/**
 * Dump/Record/Reproduce
 * 记录每一个接口和与之对应的返回结果到本地，用于重放
 */
sampleApp.registerHandler(/([\s|\S]*)/, queryRecorder(myProxy));

module.exports = sampleApp;