const Server = require("./src/server")
const config = require("./serverconfig");
console.log(config.server.router);

const myServer = new Server(config.server.config);
const routers = config.server.router.map((path) => require(path));
myServer.setRouter(routers);

myServer.start();