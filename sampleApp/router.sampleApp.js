const Handler = require("../src/handler");
const fileProcessor = require("../src/processor/fileProcessor");
const path = require("path");
const binaryProcessor = require("../src/processor/staticDirectoryProcessor")(path.resolve(__dirname, 'static'));
const binaryFileProcessor = require("../src/processor/staticFileProcessor");

const jsonProcessor = require("../src/processor/jsonProcessor");
const latencyProcessor = require("../src/processor/latencyProcessor");
const stringProcessor = require("../src/processor/stringProcessor");
const dumpPostProcessor = require("../src/processor/dumpPostProcessor");
const directoryProcessor = require("../src/processor/directoryProcessor")(path.resolve(__dirname, 'dataSource'));

const sampleApp = new Handler(/^\/api\/([\s|\S]*)/);
//测试文件做数据源输出
sampleApp.registerHandler(/\/sample\/1/, fileProcessor(path.resolve(__dirname, 'dataSource/sample.json')));
sampleApp.registerHandler(/\/sample\/2/, fileProcessor(path.resolve(__dirname, 'dataSource/sample.html')));
//测试json输出
sampleApp.registerHandler(/\/sample\/3/, jsonProcessor({
    msg: "hello, world",
    from: "json processor"
}));
//测试字符串输出
sampleApp.registerHandler(/\/sample\/4/, stringProcessor("hello, world by string processor"));
//测试延迟装饰器
sampleApp.registerHandler(/\/sample\/5/, latencyProcessor(jsonProcessor({
    msg: "hello, world",
    from: "json processor",
    latency: 3000
}), 3000));
sampleApp.registerHandler(/\/sample\/6/, dumpPostProcessor(latencyProcessor(jsonProcessor({
    msg: "hello, world",
    from: "json processor",
    latency: "random in 5000"
}), () => Math.random() * 5000)));
//测试静态文件
sampleApp.registerHandler(/\/sample\/7\/([\s|\S]*)/, binaryProcessor);
sampleApp.registerHandler(/\/sample\/widget\??([\s|\S]*)/, binaryFileProcessor('sampleApp/static/widget.zip'));
sampleApp.registerHandler(/\/sample\/info\??([\s|\S]*)/, binaryFileProcessor('sampleApp/static/install.json'));
sampleApp.registerHandler(/\/sample\/9/, directoryProcessor('sample.json'));
sampleApp.registerHandler(/\/sample\/ok/, directoryProcessor('ok.json'));
sampleApp.registerHandler(/\/sample\/points/, directoryProcessor('points.json'));
sampleApp.registerHandler(/\/api\/demondlist/, dumpPostProcessor(directoryProcessor('demondlist.json')));
module.exports = sampleApp;
