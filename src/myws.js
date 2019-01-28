//TODO
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    // You might use location.query.access_token to authenticate or share sessions 
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312) 

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.on('close', function close() {
        console.log('disconnected');
    })

    console.log('connected');
    ws.send(Date.now());
});