const static = require('node-static');
const staticHost = new (static.Server)();
const staticHandler = function (match, {req, res}) {
    staticHost.serve(req, res);
}

module.exports = staticHandler;