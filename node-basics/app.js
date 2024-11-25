const http = require('http');
const requestHandler = require('./routes');

const server = http.createServer((req, res) => {
  requestHandler.handler(req, res);
});

server.listen(3000); 