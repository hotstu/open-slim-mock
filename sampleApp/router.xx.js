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

const sampleApp = new Handler(/^\/govprocurement\/([\s|\S]*)/);
sampleApp.registerHandler(/\/govprocurement\/purchase\/baseRequire\/queryList/, dumpPostProcessor(directoryProcessor('demondlist.json')));
//sampleApp.registerHandler(/\/api/, dumpPostProcessor(directoryProcessor('demondlist.json')));
module.exports = sampleApp;
