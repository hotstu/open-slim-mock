const Handler = require("../src/handler");
const fileProcessor = require("../src/processor/fileProcessor");
const path = require("path");

const sampleApp = new Handler(/^\/sample\/([\s|\S]*)/);
sampleApp.registerHandler(/\/sample\/1/, fileProcessor(path.resolve(__dirname, 'dataSource/sample.json')));
sampleApp.registerHandler(/\/sample\/2/, fileProcessor(path.resolve(__dirname, 'dataSource/sample.html')));
module.exports = sampleApp;