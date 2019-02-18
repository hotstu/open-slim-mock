const path = require("path");

const fs = require("fs");
const {Serializer, Deserializer} = require("./buffer");
const mySerializer = Serializer();
const myDeserializer = Deserializer();
const {checksumBuffer} = require("./hash");

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
    let snap = path.resolve(destination, `snapshot.json`);
    if (fs.existsSync(snap)) {
        const buff = fs.readFileSync(snap);
        Object.assign(cache, JSON.parse(buff));
    }

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
            const tempPath = path.resolve(destination, `snapshot.json`);
            fs.writeFileSync(tempPath, Buffer.from(JSON.stringify(cache)));
            return Object.assign({}, cache);
        }
    };
};

module.exports = {MemoryCache, DiskCache};
