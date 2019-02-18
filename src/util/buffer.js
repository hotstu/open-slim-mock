const Serializer = () => (code, headers, body) => {
    //TODO 参数校验
    const magicCode = "!osm";
    const version = 1;
    const buf1 = Buffer.from(magicCode);
    console.log(buf1.length);

    const buf2 = Buffer.alloc(1);
    buf2.writeInt8(version, 0);
    const buf3 = Buffer.alloc(12);
    buf3.writeInt32BE(code, 0);
    const buf4 = Buffer.from(JSON.stringify(headers));
    const buf5 = Buffer.from(body);
    buf3.writeInt32BE(buf4.length, 4);
    buf3.writeInt32BE(buf5.length, 8);
    return Buffer.concat([buf1, buf2, buf3, buf4, buf5])
};

const Deserializer = () => (buff) => {
    //TODO 校验长度
    let offset = 0;
    const buffer = Buffer.from(buff);
    const magic = buffer.slice(0, 4).toString();
    console.log(`magic=${magic}`);
    offset += 4;
    const version = buffer.slice(offset, offset + 1).readInt8(0);
    //console.log(`version=${version}`);
    offset += 1;
    const code = buffer.slice(offset, offset + 4).readInt32BE(0);
    //console.log(`code=${code}`);
    offset += 4;
    const headerLen = buffer.slice(offset, offset + 4).readInt32BE(0);
    //console.log(`headerLen=${headerLen}`);
    offset += 4;
    const bodyLen = buffer.slice(offset, offset + 4).readInt32BE(0);
    //console.log(`bodyLen=${bodyLen}`);
    offset += 4;
    const headerStr = buffer.slice(offset, offset + headerLen).toString();
    //console.log(`headers=${headerStr}`);
    offset += headerLen;
    const body = buffer.slice(offset, offset + bodyLen);
    //console.log(`body=${body}`);
    //Buffer.
    return {
        code,
        headers: JSON.parse(headerStr),
        body
    };
};

// const myresponseSerilizer = responseSerilizer();
// const myDeserilizer = responseDeserilizer();
// let result = myresponseSerilizer(200, {lenth: 3000}, Buffer.from("test body content"));
// console.log(result.toString());
// myDeserilizer(result);

module.exports = {Serializer, Deserializer};
